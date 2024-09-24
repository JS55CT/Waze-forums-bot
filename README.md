# WazeForumProcessorBot

**Author**: JS55CT  
**Created**: October 2023  
**Updated**: September 2024  

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Forum Handling](#forum-handling)
  - [General Forum Handling](#general-forum-handling)
  - [US Unlock Forum Handling](#us-unlock-forum-handling)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Description

The `WazeForumProcessor` is a script designed to process RSS feeds from various Waze forums and send updates to designated Discord webhooks. This tool helps Waze editors stay informed about forum activities in real-time.

## Features

- Processes RSS feeds from different Waze forums.
- Converts HTML to Discord-compatible Markdown for better message formatting.
- Posts updates to specified Discord webhooks.
- Handles retries for fetching and processing RSS feeds.
- Supports acknowledging the original post's author and publishes time.

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

## Forum Handling

### General Forum Handling

The script processes the RSS feeds from the configured forums, converts the content to Discord-compatible Markdown, and posts it to the designated Discord webhooks. It keeps track of the last successfully processed timestamp to ensure that only new topics are posted.

### US Unlock Forum Handling

The script has a special handling mechanism for the US Unlock and Update Requests forum. Here's how it works:

1. **Identify Forum for State**: The script identifies the appropriate state forum based on the title of each topic and routes the update to the corresponding Discord webhook. It uses either the state name or the state code found within the title to identify the correct forum.

2. **Markdown Conversion**: Similar to other forum topics, the description is converted from HTML to Discord Markdown to ensure proper formatting in the Discord messages.

3. **Payload Construction and Posting**: The constructed payload, containing all the necessary information about the topic, is sent to the identified state forum's Discord webhook.

This targeted approach ensures that updates from the US Unlock and Update Requests forum are properly routed and posted to the relevant state forums, facilitating better organization and communication within the Waze editor community.

## Acknowledgments

This code was created by JS55CT in October 2023 and updated in September 2024. If you use or modify this code, please acknowledge the original author in your code comments.

## License

This code is licensed for free use and modification for any purpose supporting Waze Editor activities. Proper acknowledgment of the original author is appreciated.
