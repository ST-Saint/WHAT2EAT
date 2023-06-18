from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os


def start():
    # Set up Selenium webdriver
    options = webdriver.ChromeOptions()
    home_dir = os.path.expanduser("~")
    options.add_argument(r'--user-data-dir={}/.config/google-chrome'.format(home_dir))
    options.add_argument(r'--profile-directory={}/.config/google-chrome/Default'.format(home_dir))
    driver = webdriver.Chrome('chromedriver/chromedriver', chrome_options=options)  # Provide path to your chromedriver executable
    # Open Uber Eats website
    driver.get('https://www.ubereats.com')

    # Wait for the results to load
    wait = WebDriverWait(driver, 10)
    # wait.until(EC.presence_of_elements_located((By.ID, )))

    # Find the location input field and enter your location
    location_input = driver.find_element(By.CSS_SELECTOR, 'input')
    location_input.send_keys('Your Location')
    location_input.submit()

    restaurants = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[data-test-id="restaurant-card"]')))

    # Extract information from each restaurant
    for restaurant in restaurants:
        name = restaurant.find_element(By.CSS_SELECTOR, '[data-test-id="restaurant-name"]').text
        rating = restaurant.find_element(By.CSS_SELECTOR, '[data-test-id="restaurant-rating"]').text
        delivery_time = restaurant.find_element(By.CSS_SELECTOR, '[data-test-id="estimated-delivery-time"]').text
        print(f'Restaurant: {name}')
        print(f'Rating: {rating}')
        print(f'Delivery Time: {delivery_time}')
        print('---')

    # Close the browser
    driver.quit()
