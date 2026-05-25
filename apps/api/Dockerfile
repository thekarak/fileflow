FROM debian:stable-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc-dev \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy C source code
COPY src/server.c ./src/server.c

# Compile the C server with USE_POSTGRES enabled
RUN gcc src/server.c -o fileflow-server -DUSE_POSTGRES -lpq

# Expose port (Render sets PORT env dynamically)
EXPOSE 8000

# Run the C server executable
CMD ["./fileflow-server"]
