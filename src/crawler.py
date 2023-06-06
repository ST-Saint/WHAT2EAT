from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# Set up Selenium webdriver
driver = webdriver.Chrome('/path/to/chromedriver')  # Provide path to your chromedriver executable

# Open a webpage
driver.get('https://www.example.com')

# Find an element and interact with it
search_input = driver.find_element(By.NAME, 'q')
search_input.send_keys('Hello, World!')
search_input.send_keys(Keys.RETURN)

# Wait for search results to load
wait = WebDriverWait(driver, 10)
results = wait.until(EC.presence_of_element_located((By.ID, 'search-results')))

# Print the search results
print(results.text)

# Close the browser
driver.quit()
