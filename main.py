# # input urlseeds.dat, numpages, numlevels
import requests
from requests.api import get
from requests.compat import urljoin
from bs4 import BeautifulSoup
import sys
import os
import time

dirname = os.path.dirname(__file__)

class Page():
  def __init__(self, url, parent_depth):
    self.url = url
    self.parent_depth = parent_depth
    self.depth = parent_depth + 1

class Crawler():

  def __init__(self, seeds, num_pages, num_hops):
    self.num_hops = num_hops
    self.page_limit = num_pages
    self.page_count = 0
    self.page_queue = []
    self.scraped_urls = set([])

    for link in seeds:
      self.page_queue.append(Page(link, -1))

  def run_crawler(self):
    while(self.page_count < self.page_limit and self.page_queue):
      try:
        target_page = self.page_queue.pop()

        url = target_page.url

        if url not in self.scraped_urls and target_page.depth < self.num_hops:
          self.scraped_urls.add(url) # Add url to scraped urls list

          print(f'Request page: {url}')
          print(f'Page number: {self.page_count} Page Depth: {target_page.depth}')
          response = self.request_page(url) # Make an http request to url
          
          # Call functions to parse all the anchor links and to save the page to the directory
          self.parse_links(response.content, target_page)
          self.save_page(response.content, url)
          time.sleep(10)

      except Exception as e:
        print(e)
        continue
      
  def parse_links(self, html, page):
    anchor_tags = BeautifulSoup(html, features="html.parser").find_all('a', href=True)

    for link in anchor_tags:
      tag_url = link['href']
      
      if tag_url.startswith('/'):
        tag_url = urljoin(page.url, tag_url)

      if tag_url.startswith('https://'):
        if ".edu" in tag_url:
          self.page_queue.append(Page(tag_url, page.depth))

  def save_page(self, html, url):
    # print(f'Storing page: {url}')
    url = url[8:]
    url = url.replace(".", "")
    url = url.replace("/", "")
    filename = os.path.join(dirname, 'data/%s.html' % url)
    with open(filename, 'wb') as f:
      f.write(html)
    self.page_count = self.page_count + 1

  def request_page(self, url):
    try:
      response = requests.get(url, timeout=(3, 30))
      return response
    except requests.RequestException:
      return

  def info(self):
    print("Crawling Finished...")
    print(f'Crawled {self.page_count} pages...')
  

def get_seeds(filename):
  f = open(filename, 'r')
  links = [x.strip() for x in f]  # removes any leading spacing
  f.close()
  return links

if __name__ == '__main__':
  # read sys.argv[...]
  filename = sys.argv[1]
  seeds = get_seeds(filename)

  num_pages = int(sys.argv[2])

  cc = Crawler(seeds, num_pages, 8)
  cc.run_crawler()
  cc.info()