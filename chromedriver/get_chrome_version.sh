google-chrome-stable --version | awk '{print $3}' | awk -F. '{print $1}'
