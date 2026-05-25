#define _CRT_SECURE_NO_WARNINGS

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#include <direct.h>
#define close closesocket
#define popen _popen
#define pclose _pclose
#pragma comment(lib, "ws2_32.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/stat.h>
#include <sys/types.h>
#define SOCKET int
#define INVALID_SOCKET -1
#define SOCKET_ERROR -1
#define closesocket close
#define _mkdir(path) mkdir(path, 0777)
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/stat.h>

#ifdef USE_POSTGRES
#include <postgresql/libpq-fe.h>
PGconn *db_conn = NULL;
#else
void *db_conn = NULL;
#endif

#define DEFAULT_PORT 8000
#define BUFFER_SIZE 65536

// --- DSA structures ---

struct FileItem {
    char id[64];
    char original_name[256];
    char current_name[256];
    char relative_path[512];
    char mime_type[128];
    long long size_bytes;
    char category[64];
    char status[64];
    char created_at[64];
    time_t created_at_time;
    struct FileItem *next;
};

// Global Linked List Head for files
struct FileItem *files_head = NULL;

// Extension to category map for local fallback
struct ExtensionMap {
    const char *ext;
    const char *category;
};

struct ExtensionMap ext_map[] = {
    // Documents
    {".pdf", "Documents"}, {".doc", "Documents"}, {".docx", "Documents"},
    {".txt", "Documents"}, {".rtf", "Documents"}, {".xls", "Documents"},
    {".xlsx", "Documents"}, {".csv", "Documents"}, {".ppt", "Documents"},
    {".pptx", "Documents"}, {".md", "Documents"}, {".tex", "Documents"},
    // Images
    {".jpg", "Images"}, {".jpeg", "Images"}, {".png", "Images"},
    {".gif", "Images"}, {".bmp", "Images"}, {".svg", "Images"},
    {".webp", "Images"}, {".ico", "Images"},
    // Audio
    {".mp3", "Audio"}, {".wav", "Audio"}, {".flac", "Audio"},
    {".m4a", "Audio"}, {".ogg", "Audio"},
    // Video
    {".mp4", "Video"}, {".mov", "Video"}, {".avi", "Video"},
    {".mkv", "Video"}, {".webm", "Video"},
    // Code
    {".py", "Code"}, {".js", "Code"}, {".ts", "Code"},
    {".html", "Code"}, {".css", "Code"}, {".c", "Code"},
    {".cpp", "Code"}, {".java", "Code"}, {".json", "Code"},
    {".sql", "Code"}, {".sh", "Code"},
    // Archives
    {".zip", "Archives"}, {".rar", "Archives"}, {".7z", "Archives"},
    {".tar", "Archives"}, {".gz", "Archives"}
};

int ext_map_len = sizeof(ext_map) / sizeof(struct ExtensionMap);

// Helper function to search binary buffers for a pattern
char *find_bytes(const char *haystack, int haystack_len, const char *needle, int needle_len) {
    if (needle_len > haystack_len) return NULL;
    for (int i = 0; i <= haystack_len - needle_len; i++) {
        if (memcmp(haystack + i, needle, needle_len) == 0) {
            return (char *)(haystack + i);
        }
    }
    return NULL;
}

// Generate simple unique ID
void generate_uuid(char *buffer, int max_len) {
    static int counter = 0;
    srand((unsigned int)time(NULL) + counter++);
    snprintf(buffer, max_len, "%08x-%04x-%04x-%04x-%012llx",
        rand(), rand() & 0xFFFF, rand() & 0xFFFF, rand() & 0xFFFF,
        ((unsigned long long)rand() << 32) | rand());
}

// Format relative time strings
void get_relative_time_str(time_t created, char *buffer, int max_len) {
    time_t now = time(NULL);
    double diff = difftime(now, created);
    if (diff < 0) diff = 0;

    if (diff < 60) {
        snprintf(buffer, max_len, "Just now");
    } else if (diff < 3600) {
        snprintf(buffer, max_len, "%d m ago", (int)(diff / 60));
    } else if (diff < 86400) {
        snprintf(buffer, max_len, "%d h ago", (int)(diff / 3600));
    } else {
        snprintf(buffer, max_len, "%d d ago", (int)(diff / 86400));
    }
}

// Load environment variables from .env
void load_env() {
    FILE *fp = fopen(".env", "r");
    if (!fp) fp = fopen("apps/api/.env", "r");
    if (!fp) return;

    char line[1024];
    while (fgets(line, sizeof(line), fp)) {
        line[strcspn(line, "\r\n")] = 0;
        if (line[0] == '#' || line[0] == '\0') continue;

        char *eq = strchr(line, '=');
        if (eq) {
            *eq = '\0';
            char *key = line;
            char *val = eq + 1;
            // Trim quotes
            if (val[0] == '"' || val[0] == '\'') {
                val++;
                val[strcspn(val, "\"'")] = 0;
            }
            char env_str[2048];
            snprintf(env_str, sizeof(env_str), "%s=%s", key, val);
#ifdef _WIN32
            putenv(env_str);
#else
            setenv(key, val, 1);
#endif
        }
    }
    fclose(fp);
}

// Initialize PostgreSQL database connection
void init_db_connection() {
#ifdef USE_POSTGRES
    const char *db_url = getenv("DATABASE_URL");
    if (!db_url) {
        printf("DATABASE_URL is not set. Falling back to CSV file database.\n");
        return;
    }
    printf("Connecting to PostgreSQL at Neon.tech...\n");
    db_conn = PQconnectdb(db_url);
    if (PQstatus(db_conn) != CONNECTION_OK) {
        printf("Database connection failed: %s\n", PQerrorMessage(db_conn));
        PQfinish(db_conn);
        db_conn = NULL;
        printf("Falling back to CSV database.\n");
        return;
    }
    printf("Connected to PostgreSQL database successfully.\n");
    
    // Create tables if they don't exist
    PGresult *res = PQexec(db_conn,
        "CREATE TABLE IF NOT EXISTS users ("
        "id UUID PRIMARY KEY,"
        "google_id VARCHAR(255) UNIQUE NOT NULL,"
        "email VARCHAR(255) UNIQUE NOT NULL,"
        "display_name VARCHAR(255),"
        "role VARCHAR(50) DEFAULT 'user',"
        "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
        ");");
    PQclear(res);

    res = PQexec(db_conn,
        "CREATE TABLE IF NOT EXISTS files ("
        "id UUID PRIMARY KEY,"
        "user_id UUID REFERENCES users(id) ON DELETE CASCADE,"
        "original_name VARCHAR(1024) NOT NULL,"
        "current_name VARCHAR(1024) NOT NULL,"
        "relative_path TEXT NOT NULL,"
        "mime_type VARCHAR(255),"
        "size_bytes BIGINT,"
        "category VARCHAR(255),"
        "status VARCHAR(50) DEFAULT 'pending',"
        "created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
        ");");
    PQclear(res);
    
    // Insert a dummy user so that Foreign Key references don't fail
    res = PQexec(db_conn,
        "INSERT INTO users (id, google_id, email, display_name, role) "
        "VALUES ('00000000-0000-0000-0000-000000000000', 'dummy_dev_id', 'developer@fileflow.local', 'Local Developer', 'user') "
        "ON CONFLICT (google_id) DO NOTHING;");
    PQclear(res);
#endif
}

// Load database from CSV or PostgreSQL
void load_database() {
#ifdef USE_POSTGRES
    if (db_conn) {
        printf("Loading database records from PostgreSQL...\n");
        PGresult *res = PQexec(db_conn, "SELECT id, original_name, current_name, relative_path, mime_type, size_bytes, category, status, EXTRACT(EPOCH FROM created_at) FROM files ORDER BY created_at DESC");
        if (PQresultStatus(res) != PGRES_TUPLES_OK) {
            printf("Failed to fetch files from database: %s\n", PQerrorMessage(db_conn));
            PQclear(res);
            return;
        }
        
        int rows = PQntuples(res);
        for (int i = 0; i < rows; i++) {
            struct FileItem *item = malloc(sizeof(struct FileItem));
            memset(item, 0, sizeof(struct FileItem));
            
            snprintf(item->id, sizeof(item->id), "%s", PQgetvalue(res, i, 0));
            snprintf(item->original_name, sizeof(item->original_name), "%s", PQgetvalue(res, i, 1));
            snprintf(item->current_name, sizeof(item->current_name), "%s", PQgetvalue(res, i, 2));
            snprintf(item->relative_path, sizeof(item->relative_path), "%s", PQgetvalue(res, i, 3));
            snprintf(item->mime_type, sizeof(item->mime_type), "%s", PQgetvalue(res, i, 4));
            item->size_bytes = atoll(PQgetvalue(res, i, 5));
            snprintf(item->category, sizeof(item->category), "%s", PQgetvalue(res, i, 6));
            snprintf(item->status, sizeof(item->status), "%s", PQgetvalue(res, i, 7));
            item->created_at_time = (time_t)atof(PQgetvalue(res, i, 8));
            
            struct tm *t_info = localtime(&item->created_at_time);
            if (t_info) {
                strftime(item->created_at, sizeof(item->created_at), "%Y-%m-%dT%H:%M:%SZ", t_info);
            }
            
            item->next = NULL;
            if (!files_head) {
                files_head = item;
            } else {
                struct FileItem *tail = files_head;
                while (tail->next) tail = tail->next;
                tail->next = item;
            }
        }
        PQclear(res);
        printf("Loaded %d records from PostgreSQL.\n", rows);
        return;
    }
#endif

    FILE *fp = fopen("apps/api/database.csv", "r");
    if (!fp) fp = fopen("database.csv", "r");
    if (!fp) return;

    char line[2048];
    while (fgets(line, sizeof(line), fp)) {
        line[strcspn(line, "\r\n")] = 0;
        
        struct FileItem *item = malloc(sizeof(struct FileItem));
        memset(item, 0, sizeof(struct FileItem));
        
        char *id = strtok(line, ",");
        char *original_name = strtok(NULL, ",");
        char *current_name = strtok(NULL, ",");
        char *relative_path = strtok(NULL, ",");
        char *mime_type = strtok(NULL, ",");
        char *size_bytes_str = strtok(NULL, ",");
        char *category = strtok(NULL, ",");
        char *status = strtok(NULL, ",");
        char *created_at_time_str = strtok(NULL, ",");

        if (id && original_name && current_name && relative_path && mime_type && size_bytes_str && category && status && created_at_time_str) {
            snprintf(item->id, sizeof(item->id), "%s", id);
            snprintf(item->original_name, sizeof(item->original_name), "%s", original_name);
            snprintf(item->current_name, sizeof(item->current_name), "%s", current_name);
            snprintf(item->relative_path, sizeof(item->relative_path), "%s", relative_path);
            snprintf(item->mime_type, sizeof(item->mime_type), "%s", mime_type);
            item->size_bytes = atoll(size_bytes_str);
            snprintf(item->category, sizeof(item->category), "%s", category);
            snprintf(item->status, sizeof(item->status), "%s", status);
            item->created_at_time = atoll(created_at_time_str);
            
            struct tm *t_info = localtime(&item->created_at_time);
            if (t_info) {
                strftime(item->created_at, sizeof(item->created_at), "%Y-%m-%dT%H:%M:%SZ", t_info);
            }
            
            item->next = NULL;
            if (!files_head) {
                files_head = item;
            } else {
                struct FileItem *tail = files_head;
                while (tail->next) tail = tail->next;
                tail->next = item;
            }
        } else {
            free(item);
        }
    }
    fclose(fp);
    printf("Loaded database records successfully from CSV.\n");
}

// Save database to CSV file
void save_database() {
    FILE *fp = fopen("apps/api/database.csv", "w");
    if (!fp) fp = fopen("database.csv", "w");
    if (!fp) return;

    struct FileItem *curr = files_head;
    while (curr) {
        fprintf(fp, "%s,%s,%s,%s,%s,%lld,%s,%s,%lld\n",
            curr->id, curr->original_name, curr->current_name,
            curr->relative_path, curr->mime_type, curr->size_bytes,
            curr->category, curr->status, (long long)curr->created_at_time);
        curr = curr->next;
    }
    fclose(fp);
}

// Free files database and sync to storage
void clear_database() {
    struct FileItem *curr = files_head;
    while (curr) {
        struct FileItem *tmp = curr;
        curr = curr->next;
        free(tmp);
    }
    files_head = NULL;

#ifdef USE_POSTGRES
    if (db_conn) {
        PGresult *res = PQexec(db_conn, "DELETE FROM files");
        PQclear(res);
        return;
    }
#endif
    save_database();
}

// Rule-based local classifier
const char* classify_local(const char* filename, const char* mime_type) {
    char name_lower[256];
    strncpy(name_lower, filename, sizeof(name_lower) - 1);
    for (int i = 0; name_lower[i]; i++) {
        if (name_lower[i] >= 'A' && name_lower[i] <= 'Z') {
            name_lower[i] += 32;
        }
    }

    for (int i = 0; i < ext_map_len; i++) {
        if (strstr(name_lower, ext_map[i].ext) != NULL) {
            int name_len = strlen(name_lower);
            int ext_len = strlen(ext_map[i].ext);
            if (name_len >= ext_len && strcmp(name_lower + name_len - ext_len, ext_map[i].ext) == 0) {
                return ext_map[i].category;
            }
        }
    }

    if (mime_type) {
        char mime_lower[128];
        strncpy(mime_lower, mime_type, sizeof(mime_lower) - 1);
        for (int i = 0; mime_lower[i]; i++) {
            if (mime_lower[i] >= 'A' && mime_lower[i] <= 'Z') {
                mime_lower[i] += 32;
            }
        }
        if (strncmp(mime_lower, "image/", 6) == 0) return "Images";
        if (strncmp(mime_lower, "video/", 6) == 0) return "Video";
        if (strncmp(mime_lower, "audio/", 6) == 0) return "Audio";
        if (strncmp(mime_lower, "text/", 5) == 0) return "Documents";
        if (strcmp(mime_lower, "application/pdf") == 0) return "Documents";
        if (strcmp(mime_lower, "application/zip") == 0) return "Archives";
    }

    return "Other";
}

// Classify file using Gemini API or Local Fallback
const char* classify_file(const char* filename, const char* mime_type) {
    const char *api_key = getenv("GEMINI_API_KEY");
    if (!api_key) {
        return classify_local(filename, mime_type);
    }

    char cmd[4096];
    snprintf(cmd, sizeof(cmd),
        "curl -s -X POST -H \"Content-Type: application/json\" "
        "-d \"{\\\"contents\\\":[{\\\"parts\\\":[{\\\"text\\\":\\\"You are a smart file classification AI. Classify the file with name \\\\\\\"%s\\\\\\\" and MIME type \\\\\\\"%s\\\\\\\" into one of the following exact categories: Documents, Images, Audio, Video, Code, Archives, Other. Respond with ONLY the category name. No other text, punctuation, or explanation.\\\"}]}]}\" "
        "\"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s\"",
        filename, mime_type ? mime_type : "", api_key);

    FILE *fp = popen(cmd, "r");
    if (!fp) {
        return classify_local(filename, mime_type);
    }

    char response[4096] = {0};
    int bytes_read = fread(response, 1, sizeof(response) - 1, fp);
    pclose(fp);

    if (bytes_read <= 0) {
        return classify_local(filename, mime_type);
    }

    char *text_ptr = strstr(response, "\"text\":");
    if (text_ptr) {
        char *quote_start = strchr(text_ptr + 7, '"');
        if (quote_start) {
            char *quote_end = strchr(quote_start + 1, '"');
            if (quote_end) {
                int len = quote_end - (quote_start + 1);
                static char parsed_category[64];
                memset(parsed_category, 0, sizeof(parsed_category));
                if (len < 63) {
                    strncpy(parsed_category, quote_start + 1, len);
                    char *trimmed = parsed_category;
                    while (*trimmed == ' ' || *trimmed == '\n' || *trimmed == '\r') trimmed++;
                    int t_len = strlen(trimmed);
                    while (t_len > 0 && (trimmed[t_len - 1] == ' ' || trimmed[t_len - 1] == '\n' || trimmed[t_len - 1] == '\r')) {
                        trimmed[t_len - 1] = '\0';
                        t_len--;
                    }
                    
                    const char *valid[] = {"Documents", "Images", "Audio", "Video", "Code", "Archives", "Other"};
                    for (int i = 0; i < 7; i++) {
                        if (strcmp(trimmed, valid[i]) == 0) {
                            return valid[i];
                        }
                    }
                    for (int i = 0; i < 7; i++) {
                        if (strstr(trimmed, valid[i]) != NULL) {
                            return valid[i];
                        }
                    }
                }
            }
        }
    }

    return classify_local(filename, mime_type);
}

// AI processing: re-classify all files currently marked as "pending"
int process_pending_files() {
    int processed = 0;
    struct FileItem *curr = files_head;
    while (curr) {
        if (strcmp(curr->status, "pending") == 0) {
            const char *category = classify_file(curr->original_name, curr->mime_type);
            snprintf(curr->category, sizeof(curr->category), "%s", category);
            snprintf(curr->status, sizeof(curr->status), "processed");
            snprintf(curr->relative_path, sizeof(curr->relative_path), "/%s/%s", category, curr->original_name);
            processed++;
            
#ifdef USE_POSTGRES
            if (db_conn) {
                const char *params[4];
                params[0] = curr->category;
                params[1] = curr->status;
                params[2] = curr->relative_path;
                params[3] = curr->id;
                PGresult *res = PQexecParams(db_conn,
                    "UPDATE files SET category = $1, status = $2, relative_path = $3 WHERE id = $4",
                    4, NULL, params, NULL, NULL, 0);
                PQclear(res);
            }
#endif
        }
        curr = curr->next;
    }
    if (processed > 0 && !db_conn) {
        save_database();
    }
    return processed;
}

// Generate JSON list of activities dynamically from files list
char* get_activities_json() {
    int count = 0;
    int max_nodes = 20;
    
    struct FileItem *curr = files_head;
    int buffer_needed = 1024;
    while (curr && count < max_nodes) {
        buffer_needed += strlen(curr->original_name) + strlen(curr->category) + strlen(curr->relative_path) + 512;
        count++;
        curr = curr->next;
    }

    char *json = malloc(buffer_needed);
    if (!json) return strdup("[]");
    strcpy(json, "[");

    curr = files_head;
    count = 0;
    while (curr && count < max_nodes) {
        char time_str[64];
        get_relative_time_str(curr->created_at_time, time_str, sizeof(time_str));

        char item_buf[2048];
        snprintf(item_buf, sizeof(item_buf),
            "{\"file\": \"%s\", \"action\": \"Classified as %s · moved to %s\", \"time\": \"%s\", \"category\": \"%s\", \"size\": %lld}%s",
            curr->original_name, curr->category, curr->relative_path, time_str, curr->category, curr->size_bytes,
            (curr->next && count + 1 < max_nodes) ? "," : "");
            
        strcat(json, item_buf);
        count++;
        curr = curr->next;
    }
    strcat(json, "]");
    return json;
}

// Generate files flat list JSON
char* get_files_json() {
    int buffer_needed = 1024;
    struct FileItem *curr = files_head;
    while (curr) {
        buffer_needed += strlen(curr->id) + strlen(curr->original_name) + strlen(curr->current_name) +
                         strlen(curr->relative_path) + strlen(curr->mime_type) + strlen(curr->category) +
                         strlen(curr->status) + strlen(curr->created_at) + 256;
        curr = curr->next;
    }
    
    char *json = malloc(buffer_needed);
    if (!json) return strdup("[]");
    strcpy(json, "[");
    
    curr = files_head;
    while (curr) {
        char item_buf[2048];
        snprintf(item_buf, sizeof(item_buf),
            "{\"id\": \"%s\", \"user_id\": \"dummy\", \"original_name\": \"%s\", \"current_name\": \"%s\", "
            "\"relative_path\": \"%s\", \"mime_type\": \"%s\", \"size_bytes\": %lld, \"category\": \"%s\", "
            "\"status\": \"%s\", \"created_at\": \"%s\"}%s",
            curr->id, curr->original_name, curr->current_name, curr->relative_path,
            curr->mime_type, curr->size_bytes, curr->category, curr->status, curr->created_at,
            curr->next ? "," : "");
        strcat(json, item_buf);
        curr = curr->next;
    }
    strcat(json, "]");
    return json;
}

// Generate stats summary JSON (uses local DSA CategoryCount map representation)
char* get_stats_json() {
    int total_files = 0;
    int files_organized = 0;
    long long total_bytes = 0;
    
    struct CategoryCount {
        char name[64];
        int count;
        struct CategoryCount *next;
    };
    struct CategoryCount *cat_counts = NULL;

    struct FileItem *curr = files_head;
    while (curr) {
        total_files++;
        if (strcmp(curr->status, "processed") == 0) {
            files_organized++;
        }
        total_bytes += curr->size_bytes;
        
        struct CategoryCount *c_curr = cat_counts;
        int found = 0;
        while (c_curr) {
            if (strcmp(c_curr->name, curr->category) == 0) {
                c_curr->count++;
                found = 1;
                break;
            }
            c_curr = c_curr->next;
        }
        if (!found) {
            struct CategoryCount *c_new = malloc(sizeof(struct CategoryCount));
            snprintf(c_new->name, sizeof(c_new->name), "%s", curr->category);
            c_new->count = 1;
            c_new->next = cat_counts;
            cat_counts = c_new;
        }

        curr = curr->next;
    }

    int org_score = total_files > 0 ? (int)((double)files_organized / total_files * 100) : 100;

    char categories_json[2048] = "{";
    struct CategoryCount *c_curr = cat_counts;
    while (c_curr) {
        char item_buf[256];
        snprintf(item_buf, sizeof(item_buf), "\"%s\": %d%s", c_curr->name, c_curr->count, c_curr->next ? "," : "");
        strcat(categories_json, item_buf);
        
        struct CategoryCount *tmp = c_curr;
        c_curr = c_curr->next;
        free(tmp);
    }
    strcat(categories_json, "}");

    char *json = malloc(4096);
    if (!json) return strdup("{}");
    
    snprintf(json, 4096,
        "{\"total_files\": %d, \"files_organized\": %d, \"total_bytes\": %lld, \"org_score\": %d, \"categories\": %s}",
        total_files, files_organized, total_bytes, org_score, categories_json);
        
    return json;
}

// Send standard JSON response with CORS headers
void send_json_response(SOCKET client, int status, const char *json, const char *cors) {
    char headers[1024];
    int len = strlen(json);
    
    const char *status_str = "200 OK";
    if (status == 404) status_str = "404 Not Found";
    else if (status == 400) status_str = "400 Bad Request";
    
    snprintf(headers, sizeof(headers),
        "HTTP/1.1 %s\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: %d\r\n"
        "%s"
        "\r\n",
        status_str, len, cors);
        
    send(client, headers, strlen(headers), 0);
    send(client, json, len, 0);
}

// Multipart upload request parser and C DB insertions
void handle_upload_request(SOCKET client, const char *req, int req_len, int header_len, int body_len, const char *cors) {
    const char *body_start = req + header_len;
    
    // 1. Find filename
    const char *filename_attr = "filename=\"";
    const char *filename_ptr = strstr(body_start, filename_attr);
    if (!filename_ptr) {
        filename_ptr = strstr(req, filename_attr); // Backup search
    }
    
    char filename[256] = {0};
    if (filename_ptr) {
        filename_ptr += strlen(filename_attr);
        const char *end = strchr(filename_ptr, '"');
        if (end) {
            int len = end - filename_ptr;
            if (len < 255) {
                strncpy(filename, filename_ptr, len);
            }
        }
    } else {
        send_json_response(client, 400, "{\"error\": \"Missing file part filename\"}", cors);
        return;
    }

    // 2. Find mime_type
    char mime_type[128] = {0};
    const char *mime_ptr = strstr(filename_ptr, "Content-Type:");
    if (mime_ptr) {
        mime_ptr += 13;
        while (*mime_ptr == ' ' || *mime_ptr == '\t') mime_ptr++;
        const char *end = strchr(mime_ptr, '\r');
        if (end) {
            int len = end - mime_ptr;
            if (len < 127) {
                strncpy(mime_type, mime_ptr, len);
            }
        }
    }

    // 3. Find boundary string
    char boundary[128] = {0};
    const char *boundary_attr = "boundary=";
    const char *boundary_ptr = strstr(req, boundary_attr);
    if (boundary_ptr) {
        boundary_ptr += strlen(boundary_attr);
        const char *end = strchr(boundary_ptr, '\r');
        if (end) {
            int len = end - boundary_ptr;
            if (boundary_ptr[0] == '"' && boundary_ptr[len - 1] == '"') {
                boundary_ptr++;
                len -= 2;
            }
            if (len < 127) {
                strncpy(boundary, boundary_ptr, len);
            }
        }
    }

    char boundary_marker[256];
    snprintf(boundary_marker, sizeof(boundary_marker), "--%s", boundary);

    // 4. Locate file bytes start and end
    const char *file_bytes_start = strstr(mime_ptr ? mime_ptr : body_start, "\r\n\r\n");
    if (file_bytes_start) {
        file_bytes_start += 4;
    } else {
        send_json_response(client, 400, "{\"error\": \"Malformed file parts structure\"}", cors);
        return;
    }

    int remaining_search_len = (req + req_len) - file_bytes_start;
    const char *file_bytes_end = find_bytes(file_bytes_start, remaining_search_len, boundary_marker, strlen(boundary_marker));
    
    int file_size = 0;
    if (file_bytes_end) {
        file_size = (file_bytes_end - file_bytes_start) - 2; // Trim preceding \r\n
        if (file_size < 0) file_size = 0;
    } else {
        file_size = (req + req_len) - file_bytes_start;
    }

    // 5. Create directories and write file to disk
    _mkdir("uploads");
    _mkdir("apps");
    _mkdir("apps/api");
    _mkdir("apps/api/uploads");
    
    char filepath[512];
    snprintf(filepath, sizeof(filepath), "apps/api/uploads/%s", filename);
    FILE *out = fopen(filepath, "wb");
    if (out) {
        if (file_size > 0) {
            fwrite(file_bytes_start, 1, file_size, out);
        }
        fclose(out);
    }

    // 6. Classify
    const char *category = classify_file(filename, mime_type);

    // 7. Add record to C Linked List Database
    struct FileItem *item = malloc(sizeof(struct FileItem));
    memset(item, 0, sizeof(struct FileItem));
    
    generate_uuid(item->id, sizeof(item->id));
    snprintf(item->original_name, sizeof(item->original_name), "%s", filename);
    snprintf(item->current_name, sizeof(item->current_name), "%s", filename);
    snprintf(item->relative_path, sizeof(item->relative_path), "/%s/%s", category, filename);
    snprintf(item->mime_type, sizeof(item->mime_type), "%s", mime_type);
    item->size_bytes = file_size;
    snprintf(item->category, sizeof(item->category), "%s", category);
    snprintf(item->status, sizeof(item->status), "processed");
    item->created_at_time = time(NULL);
    
    struct tm *t_info = localtime(&item->created_at_time);
    if (t_info) {
        strftime(item->created_at, sizeof(item->created_at), "%Y-%m-%dT%H:%M:%SZ", t_info);
    }

    // Insert at HEAD for reverse chronological default sorting
    item->next = files_head;
    files_head = item;

    // Save changes (sync with PG if enabled, otherwise fallback write to database.csv)
#ifdef USE_POSTGRES
    if (db_conn) {
        const char *paramValues[9];
        paramValues[0] = item->id;
        paramValues[1] = "00000000-0000-0000-0000-000000000000"; // user_id (dummy)
        paramValues[2] = item->original_name;
        paramValues[3] = item->current_name;
        paramValues[4] = item->relative_path;
        paramValues[5] = item->mime_type;
        
        char size_str[32];
        snprintf(size_str, sizeof(size_str), "%lld", item->size_bytes);
        paramValues[6] = size_str;
        
        paramValues[7] = item->category;
        paramValues[8] = item->status;
        
        PGresult *res = PQexecParams(db_conn,
            "INSERT INTO files (id, user_id, original_name, current_name, relative_path, mime_type, size_bytes, category, status) "
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            9, NULL, paramValues, NULL, NULL, 0);
            
        if (PQresultStatus(res) != PGRES_COMMAND_OK) {
            printf("Failed to insert file to PostgreSQL: %s\n", PQerrorMessage(db_conn));
        }
        PQclear(res);
    } else {
        save_database();
    }
#else
    save_database();
#endif

    // 8. Return response
    char response_json[1024];
    snprintf(response_json, sizeof(response_json),
        "{\"filename\": \"%s\", \"status\": \"processed\", \"category\": \"%s\", \"size_bytes\": %d, \"proposed_path\": \"/%s/%s\"}",
        filename, category, file_size, category, filename);
        
    send_json_response(client, 200, response_json, cors);
}

// Dispatch HTTP request
void process_http_request(SOCKET client, const char *req, int req_len, int header_len, int body_len) {
    char method[16] = {0};
    char path[512] = {0};
    sscanf(req, "%15s %511s", method, path);

    const char *cors_headers = 
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type, Authorization\r\n";

    if (strcmp(method, "OPTIONS") == 0) {
        char response[1024];
        snprintf(response, sizeof(response),
            "HTTP/1.1 200 OK\r\n"
            "%s"
            "Content-Length: 0\r\n"
            "\r\n", cors_headers);
        send(client, response, strlen(response), 0);
        return;
    }

    if (strcmp(path, "/") == 0) {
        send_json_response(client, 200, "{\"message\": \"Welcome to Fileflow API\"}", cors_headers);
    }
    else if (strcmp(path, "/api/v1/auth/login") == 0) {
        char json[256];
        snprintf(json, sizeof(json),
            "{\"status\": \"authenticated\", \"user_id\": \"dummy-c-user-id\", \"token\": \"dummy_jwt_token_for_local_dev\"}");
        send_json_response(client, 200, json, cors_headers);
    }
    else if (strcmp(path, "/api/v1/files/activity") == 0) {
        char *json = get_activities_json();
        send_json_response(client, 200, json, cors_headers);
        free(json);
    }
    else if (strcmp(path, "/api/v1/files/stats") == 0) {
        char *json = get_stats_json();
        send_json_response(client, 200, json, cors_headers);
        free(json);
    }
    else if (strcmp(path, "/api/v1/files/clear") == 0 && strcmp(method, "DELETE") == 0) {
        clear_database();
        send_json_response(client, 200, "{\"message\": \"All files cleared\"}", cors_headers);
    }
    else if (strcmp(path, "/api/v1/files/process") == 0 && strcmp(method, "POST") == 0) {
        int processed = process_pending_files();
        char json[256];
        snprintf(json, sizeof(json), "{\"processed\": %d, \"message\": \"Processed %d files from inbox\"}", processed, processed);
        send_json_response(client, 200, json, cors_headers);
    }
    else if (strcmp(path, "/api/v1/files/upload") == 0 && strcmp(method, "POST") == 0) {
        handle_upload_request(client, req, req_len, header_len, body_len, cors_headers);
    }
    else if (strcmp(path, "/api/v1/files") == 0 || strcmp(path, "/api/v1/files/") == 0) {
        char *json = get_files_json();
        send_json_response(client, 200, json, cors_headers);
        free(json);
    }
    else {
        send_json_response(client, 404, "{\"error\": \"Not Found\"}", cors_headers);
    }
}

// Client socket connection loop
void handle_client(SOCKET client_sock) {
    char *request = malloc(BUFFER_SIZE);
    if (!request) {
        closesocket(client_sock);
        return;
    }
    memset(request, 0, BUFFER_SIZE);

    int total_received = 0;
    int header_received = 0;
    int content_length = 0;
    char *body_ptr = NULL;

    int n = recv(client_sock, request, BUFFER_SIZE - 1, 0);
    if (n <= 0) {
        free(request);
        closesocket(client_sock);
        return;
    }
    total_received = n;

    body_ptr = strstr(request, "\r\n\r\n");
    if (body_ptr) {
        header_received = (body_ptr - request) + 4;
        char *cl_ptr = strstr(request, "Content-Length:");
        if (!cl_ptr) cl_ptr = strstr(request, "content-length:");
        if (cl_ptr) {
            content_length = atoi(cl_ptr + 15);
        }
    }

    if (content_length > 0) {
        int body_received = total_received - header_received;
        int needed_size = header_received + content_length + 1;
        if (needed_size > BUFFER_SIZE) {
            char *temp = realloc(request, needed_size);
            if (!temp) {
                free(request);
                closesocket(client_sock);
                return;
            }
            request = temp;
            memset(request + total_received, 0, needed_size - total_received);
            body_ptr = request + (header_received - 4);
        }

        while (body_received < content_length) {
            int to_read = content_length - body_received;
            n = recv(client_sock, request + total_received, to_read, 0);
            if (n <= 0) break;
            total_received += n;
            body_received += n;
        }
    }

    process_http_request(client_sock, request, total_received, header_received, content_length);

    free(request);
    closesocket(client_sock);
}

// Dynamic port determination
int get_port() {
    const char *port_str = getenv("PORT");
    if (port_str) {
        return atoi(port_str);
    }
    return DEFAULT_PORT;
}

int main() {
    // 1. Load configuration and cache
    load_env();
    
    // 2. Initialize DB Connection
    init_db_connection();
    
    // 3. Load cache from DB / CSV
    load_database();

#ifdef _WIN32
    // Winsock startup
    WSADATA wsa;
    printf("Initializing Winsock Services...\n");
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("Winsock initialization failed. Error : %d\n", WSAGetLastError());
        return 1;
    }
#endif

    SOCKET server_fd, new_socket;
    struct sockaddr_in address;
#ifdef _WIN32
    int addrlen = sizeof(address);
#else
    socklen_t addrlen = sizeof(address);
#endif

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET) {
        printf("Socket creation failed\n");
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (const char *)&opt, sizeof(opt));

    int port = get_port();
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) == SOCKET_ERROR) {
        printf("Socket bind failed\n");
        closesocket(server_fd);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    if (listen(server_fd, 10) == SOCKET_ERROR) {
        printf("Socket listen failed\n");
        closesocket(server_fd);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    printf("\n======================================================\n");
    printf("   FileFlow C & DSA Web Server Running on Port %d\n", port);
#ifdef USE_POSTGRES
    printf("   Database: %s\n", db_conn ? "Neon.tech PostgreSQL (Dynamic Cache)" : "Local CSV File Fallback");
#else
    printf("   Database: Local CSV File (database.csv)\n");
#endif
    printf("   Classifier: %s\n", getenv("GEMINI_API_KEY") ? "Gemini AI Studio API" : "Local Rule Fallback");
    printf("======================================================\n\n");

    while (1) {
        new_socket = accept(server_fd, (struct sockaddr *)&address, &addrlen);
        if (new_socket == INVALID_SOCKET) {
            continue;
        }
        handle_client(new_socket);
    }

    closesocket(server_fd);
#ifdef _WIN32
    WSACleanup();
#endif
    return 0;
}
