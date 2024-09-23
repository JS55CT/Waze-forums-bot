# WazeForumProcessor

**Author**: JS55CT  
**Created**: October 2023  
**Updated**: September 2024  

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Description

The `WazeForumProcessor` is a script designed to process RSS feeds from various Waze forums and send updates to designated Discord webhooks. This tool helps Waze editors stay informed about forum activities in real-time.

## Features

- Processes RSS feeds from different Waze forums.
- Converts HTML to Discord-compatible Markdown for better message formatting.
- Posts updates to specified Discord webhooks.
- Handles retries for fetching and processing RSS feeds.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/WazeForumProcessor.git
    ```
2. Follow the guidelines to set up the script in your preferred environment (e.g., Google Apps Script).

## Usage

1. Define the list of forums and associated webhook URLs:
    ```javascript
    var forums = [
      {
        "name": "Connecticut Forum",
        "state_name": "Connecticut",
        "state_code": "CT",
        "link": "https://www.waze.com/discuss/c/editors/united-states/connecticut/4845",
        "feed": "https://www.waze.com/discuss/c/editors/united-states/connecticut/4845.rss",
        "webhook": "YOUR_DISCORD_WEBHOOK_URL"
      },
      // Add more forums as required
    ];
    ```

2. Deploy the script, ensuring it runs on a schedule to fetch updates periodically.

3. The script processes forum activities and posts them to the designated Discord channels.

## Acknowledgments

This code was created by JS55CT in October 2023 and updated in September 2024. If you use or modify this code, please acknowledge the original author in your code comments.

## License

This code is licensed for free use and modification for any purpose supporting Waze Editor activities. Proper acknowledgment of the original author is appreciated.
