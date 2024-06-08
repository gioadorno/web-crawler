import { test, expect } from "@jest/globals"
import { normalizeURL, getURLsFromHTML } from "./crawl.js"

// Grouping related tests
describe('normalizeURL', () => {

  test('should remove protocol and trailing slash', () => {
    const input = 'https://blog.boot.dev/path/';
    const expectedOutput = 'blog.boot.dev/path';
    const result = normalizeURL(input);

    //Assertion
    expect(result).toBe(expectedOutput);
  })

  test('should remove protocol', () => {
    const input = 'http://blog.boot.dev/path';
    const expectedOutput = 'blog.boot.dev/path';
    const result = normalizeURL(input);

    //Assertion
    expect(result).toBe(expectedOutput);
  })

  test('should handle URLs with subdomain', () => {
    const input = 'https://www.boot.dev/path/';
    const expectedOutput = 'boot.dev/path';
    const result = normalizeURL(input);
    expect(result).toBe(expectedOutput);
  });

  test('should remove ports from URL', () => {
    const input = 'http://example.com:8080/path';
    const expectedOutput = 'example.com/path';
    const result = normalizeURL(input);
    expect(result).toBe(expectedOutput);
  });

  test('should remove query parameters from URL', () => {
    const input = 'http://example.com/path?query=1';
    const expectedOutput = 'example.com/path';
    const result = normalizeURL(input);
    expect(result).toBe(expectedOutput);
  });

  test('should remove fragment identifiers from URL', () => {
    const input = 'http://example.com/path#section';
    const expectedOutput = 'example.com/path';
    const result = normalizeURL(input);
    expect(result).toBe(expectedOutput);
  });
})

describe('getURLsFromHTML', () => {
    test('Simple HTML with an absolute URL', () => {
    const htmlInput = `<html><body><a href="https://example.com">Example</a></body></html>`;
    const baseURL = "https://example.com";
    const expectedOutput = ["example.com"];
    const actualOutput = getURLsFromHTML(htmlInput, baseURL);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('HTML with relative URL and baseURL', () => {
    const htmlInput = `<html><body><a href="/about">About</a></body></html>`;
    const baseURL = "https://example.com";
    const expectedOutput = ["example.com/about"];
    const actualOutput = getURLsFromHTML(htmlInput, baseURL);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('HTML with no links', () => {
    const htmlInput = `<html><body><p>No links here!</p></body></html>`;
    const baseURL = "https://example.com";
    const expectedOutput = [];
    const actualOutput = getURLsFromHTML(htmlInput, baseURL);
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should return an array of normalized urls', () => {
    const html = `<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
    </body>
</html>
`
      const url = 'https://blog.boot.dev'
    const expectedOutput = ['blog.boot.dev']
    const result = getURLsFromHTML(html, url)
    expect(result).toEqual(expectedOutput)
  })
})
