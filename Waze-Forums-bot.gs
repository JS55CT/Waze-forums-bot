/**************************************************
 * Configuration
 **************************************************/
// Each forum link is paired with a corresponding webhook
var forums = [
  {
    "name": "Connecticut Forum",
    "state_name": "Connecticut",
    "state_code": "CT",
    "link": "https://www.waze.com/discuss/c/editors/united-states/connecticut/4845",
    "feed": "https://www.waze.com/discuss/c/editors/united-states/connecticut/4845.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "Maine Forum",
    "state_name": "Maine",
    "state_code": "ME",
    "link": "https://www.waze.com/discuss/c/editors/united-states/maine/4858",
    "feed": "https://www.waze.com/discuss/c/editors/united-states/maine/4858.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "Massachusetts Forum",
    "state_name": "Massachusetts",
    "state_code": "MA",
    "link": "https://www.waze.com/discuss/c/editors/united-states/massachusetts/4860",
    "feed": "https://www.waze.com/discuss/c/editors/united-states/massachusetts/4860.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "New Hampshire Forum",
    "state_name": "New Hampshire",
    "state_code": "NH",
    "link": "https://www.waze.com/discuss/c/editors/united-states/new-hampshire/4868",
    "feed": "https://www.waze.com/discuss/c/editors/united-states/new-hampshire/4868.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "Rhode Island Forum",
    "state_name": "Rhode Island",
    "state_code": "RI",
    "link": "https://www.waze.com/discuss/c/editors/united-states/rhode-island/4880",
    "feed": "https://www.waze.com/discuss/c/editors/united-states/rhode-island/4880.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "Vermont Forum",
    "state_name": "Vermont",
    "state_code": "VT",
    "link": "https://www.waze.com/discuss/c/editors/united-states/vermont/4896",
    "feed": "https://www.waze.com/discuss/c/editors/united-states/vermont/4896.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  /*{
    "name": "US New England Forum",
    "state_name": "New England",
    "state_code": "NER",
    "link": "https://www.waze.com/forum/viewforum.php?f=945&sk=t&sv=0&sc=1&sd=d",
    "feed": "https://www.waze.com/forum/app.php/feed/forum/945",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },*/
  {
    "name": "Official Announcements Forum",
    "state_name": "NOT A STATE",
    "state_code": "NOT A STATE",
    "link": "https://www.waze.com/discuss/c/editors/official-announcements/4637",
    "feed": "https://www.waze.com/discuss/c/editors/official-announcements/4637.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "Waze Map Editor Forum",
    "state_name": "NOT A STATE",
    "state_code": "NOT A STATE",
    "link": "https://www.waze.com/discuss/c/editors/waze-map-editors-topics/4930",
    "feed": "https://www.waze.com/discuss/c/editors/waze-map-editors-topics/4930.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  {
    "name": "Waze WME Production Version Releases Forum",
    "state_name": "NOT A STATE",
    "state_code": "NOT A STATE",
    "link": "https://www.waze.com/discuss/c/editors/wme-production-version-releases/4934",
    "feed": "https://www.waze.com/discuss/c/editors/wme-production-version-releases/4934.rss",
    "webhook": "https://discord.com/api/webhooks/ENTER_WEBHOOK_ID_HERE"
  },
  // additional forums...
];

/**************************************************
 * Main Script
 **************************************************/
function process_All_Forums() {
  processWazeForumFeed();
  process_Waze_US_Unlock_Forum();
}

/**************************************************
 * Forum Processing Functions
 **************************************************/
function processWazeForumFeed() {
  // Get the script's properties
  const scriptProperties = PropertiesService.getScriptProperties();

  for (let i = 0; i < forums.length; i++) {
    const forum = forums[i];
    let newTopicsFound = false;  // Variable to track if new topics are found

    // Create a forum-specific key for last success timestamp
    const forumSuccessKey = 'lastSuccess_' + forum.name;

    // Get the last success timestamp for this forum
    const lastSuccessTime = scriptProperties.getProperty(forumSuccessKey);

    let response;
    let tries = 3; // Maximum number of retry attempts

    while (tries > 0) {
      try {
        response = UrlFetchApp.fetch(forum.feed);
        const xml = response.getContentText();

        // Check if XML starts with the proper declaration
        if (xml.trim().substring(0, 5) !== '<?xml') {
          throw `The content from ${forum.feed} does not start with XML declaration.`;
        }

        const document = XmlService.parse(xml);
        const root = document.getRootElement();
        const channel = root.getChild('channel');

        if (!channel) throw new Error(`Missing <channel> in feed: ${forum.feed}`);

        const items = channel.getChildren('item');
        const dcNamespace = XmlService.getNamespace('dc', 'http://purl.org/dc/elements/1.1/');

        for (let j = 0; j < items.length; j++) {
          const item = items[j];

          // Fetch elements safely
          const titleElement = item.getChild('title');
          const publishedElement = item.getChild('pubDate');
          const authorElement = item.getChild('creator', dcNamespace);
          const idElement = item.getChild('guid');
          const linkElement = item.getChild('link');
          const categoryElement = item.getChild('category');
          const descriptionElement = item.getChild('description');

          // Check if elements exist
          const missingElements = [];
          if (!titleElement) missingElements.push('title');
          if (!publishedElement) missingElements.push('pubDate');
          if (!authorElement) missingElements.push('dc:creator');
          if (!idElement) missingElements.push('guid');
          if (!linkElement) missingElements.push('link');
          if (!categoryElement) missingElements.push('category');
          if (!descriptionElement) missingElements.push('description');

          if (missingElements.length > 0) {
            console.warn(`Missing elements [${missingElements.join(', ')}] in item: ${XmlService.getRawFormat().format(item)}`);
            continue;  // Skip this item
          }

          const title = titleElement.getText();
          const published = publishedElement.getText();
          const author = authorElement.getText();
          const id = idElement.getText();
          const link = linkElement.getText();
          const category = categoryElement.getText();
          const description_raw = descriptionElement.getText();
          const description = convertDiscussHtmlToDiscordMarkdown(description_raw);

          // Skip this topic if it was published before our last success
          if (lastSuccessTime && new Date(lastSuccessTime) > new Date(published)) {
            continue;
          }

          const topic = {
            title,
            published,
            author,
            id,
            link,
            category,
            description
          };

          // Construct payload for the new topic and post it
          const payload = constructPayloadForums(topic, forum.name);
          newTopicsFound = true;  // Set variable to true when a new topic is found
          postDiscord_forums(payload, forum.webhook);
        }

        // After processing all entries, save the current timestamp as last successful fetch time for this forum
        if (!newTopicsFound) {
          Logger.log(`The feed '${forum.name}' was processed, but contains no new topics.`);
        } else {
          Logger.log(`New topics were found and processed in the feed '${forum.name}'.`);
          const now = new Date();
          scriptProperties.setProperty(forumSuccessKey, now.toISOString());
        }

        break; // If no errors, break the retry loop
      } catch (error) {
        console.error(`Failed to fetch or parse XML from url: ${forum.feed}\nError: ${error}`);

        tries--;
        if (tries > 0) {
          console.log('Retrying in 1 second...');
          Utilities.sleep(1000);  // Wait 1 second
        } else {
          console.log('Reached maximum retry attempts. Skipping this forum feed.');
          break;  // Avoid infinite loop when maximum retry attempts reached
        }
      }
    }
  }
}

function process_Waze_US_Unlock_Forum() {
  const url = 'https://www.waze.com/discuss/c/editors/united-states/us-unlock-and-update-requests/4891.rss';
  const forumSuccessKey = 'US_Unlock_Forum';
  const scriptProperties = PropertiesService.getScriptProperties();
  const lastSuccessTime = scriptProperties.getProperty(forumSuccessKey);

  let response;
  let tries = 3; // Maximum number of retry attempts

  while (tries > 0) {
    try {
      response = UrlFetchApp.fetch(url);
      const xml = response.getContentText();

      // Check if XML starts with the proper declaration
      if (xml.trim().substring(0, 5) !== '<?xml') {
        throw `The content from ${url} does not start with XML declaration.`;
      }

      const document = XmlService.parse(xml);
      const root = document.getRootElement();

      const channel = root.getChild('channel');
      if (!channel) throw new Error(`Missing <channel> in feed: ${url}`);

      const items = channel.getChildren('item');
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Fetch elements safely
        const titleElement = item.getChild('title');
        const publishedElement = item.getChild('pubDate');
        const authorElement = item.getChild('creator', XmlService.getNamespace('dc', 'http://purl.org/dc/elements/1.1/'));
        const idElement = item.getChild('guid');
        const linkElement = item.getChild('link');
        const categoryElement = item.getChild('category');
        const descriptionElement = item.getChild('description');

        // Check if elements exist
        const missingElements = [];
        if (!titleElement) missingElements.push('title');
        if (!publishedElement) missingElements.push('pubDate');
        if (!authorElement) missingElements.push('dc:creator');
        if (!idElement) missingElements.push('guid');
        if (!linkElement) missingElements.push('link');
        if (!categoryElement) missingElements.push('category');
        if (!descriptionElement) missingElements.push('description');

        if (missingElements.length > 0) {
          console.warn(`Missing elements [${missingElements.join(', ')}] in item: ${XmlService.getRawFormat().format(item)}`);
          continue;  // Skip this item
        }

        const title = titleElement.getText();
        const lowercaseTitle = title.toLowerCase(); // Convert the title to lowercase for case-insensitive comparisons
        const stateCodeRegex = /(?:,|$$\-)\s*([a-z]{2})\s*(?:,|$$\-)/i; // Regex to match state code
        const stateCodeMatch = stateCodeRegex.exec(lowercaseTitle); // Check if the state code regex matches any part of the title
        const forum = forums.find(x =>
          stateCodeMatch && // Check if stateCodeMatch is not null or undefined before accessing its properties
          stateCodeMatch[1].toLowerCase() === x.state_code.toLowerCase() || // Compare the extracted state code with x.state_code
          lowercaseTitle.includes(x.state_name.toLowerCase()) // Check if the lowercase title includes x.state_name
        );

        if (!forum) {
          Logger.log(`US_Unlock_Forum: Could not find forum for message: "${title}"`);
          continue;
        }

        const published = publishedElement.getText();
        if (lastSuccessTime && new Date(lastSuccessTime) > new Date(published)) {
          Logger.log(`US_Unlock_Forum: Skipping already posted message: "${title}"`);
          continue;
        }
        const author = authorElement.getText();
        const id = idElement.getText();
        const link = linkElement.getText();
        const category = categoryElement.getText();
        const description_raw = descriptionElement.getText();
        const description = convertDiscussHtmlToDiscordMarkdown(description_raw);

        const topic = {
          title,
          published,
          author,
          id,
          link,
          category,
          description
        };

        const payload = constructPayloadForums(topic, forum.name);
        Logger.log(payload);
        postDiscord_forums(payload, forum.webhook);

        // Update last success time
        const now = new Date();
        scriptProperties.setProperty(forumSuccessKey, now.toISOString());
      }

      break; // If no errors, break the retry loop
    } catch (error) {
      console.error(`Failed to fetch or parse XML from url: ${url}\nError: ${error}`);

      tries--;
      if (tries > 0) {
        console.log('Retrying in 1 second...');
        Utilities.sleep(1000);  // Wait 1 second
      } else {
        console.log('Reached maximum retry attempts. Skipping this forum feed.');
        break;  // Avoid infinite loop when maximum retry attempts reached
      }
    }
  }
}


/**************************************************
 * Utility Functions
 **************************************************/

/*
 * Converts HTML string to Discord Markdown format.
 * @param {string} htmlString - The input HTML string.
 * @returns {string} - The converted Markdown string.
 */
function convertDiscussHtmlToDiscordMarkdown(htmlString) {
  // Remove CDATA markers
  htmlString = htmlString
    .replace('<![CDATA[', '')
    .replace(']]>', '');

  // Remove specific small tags and "Read full topic" links
  htmlString = htmlString
    .replace(/<p><small>.*?<\/small><\/p>/gi, '')
    .replace(/<p><a href=".*">Read full topic<\/a><\/p>/gi, '');

  // Convert relevant HTML tags to Markdown equivalents
  let markdownString = htmlString
    .replace(/<b>(.*?)<\/b>/gi, '**$1**') // Bold
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**') // Bold
    .replace(/<i>(.*?)<\/i>/gi, '*$1*') // Italic
    .replace(/<em>(.*?)<\/em>/gi, '*$1*') // Italic
    .replace(/<u>(.*?)<\/u>/gi, '__$1__') // Underline
    .replace(/<s>(.*?)<\/s>/gi, '~~$1~~') // Strikethrough
    .replace(/<strike>(.*?)<\/strike>/gi, '~~$1~~') // Strikethrough
    .replace(/<code>(.*?)<\/code>/gi, '`$1`') // Inline code
    .replace(/<pre>(.*?)<\/pre>/gi, '```\n$1\n```') // Code block
    .replace(/<a href="([^"]+)".*?>(.*?)<\/a>/gi, '[$2]($1)') // Links
    .replace(/<br\s*\/?>/gi, '\n') // Line breaks
    .replace(/<\/?\s*p>/gi, '') // Paragraphs
    .replace(/<\/?h1>/gi, '# ') // Headers
    .replace(/<\/?h2>/gi, '## ')
    .replace(/<\/?h3>/gi, '### ')
    .replace(/<\/?h[4-6]>/gi, '#### ');

  // Handle tables, replacing HTML table tags with Markdown table equivalents
  markdownString = markdownString
    .replace(/<thead>/gi, '')
    .replace(/<\/thead>/gi, '')
    .replace(/<tbody>/gi, '')
    .replace(/<\/tbody>/gi, '\n')
    .replace(/<\/table>/gi, '\n')
    .replace(/<table>/gi, '\n')
    .replace(/<tr>/gi, '\n')       // Row start
    .replace(/<\/tr>/gi, ' |')     // Row end
    .replace(/<th>/gi, '| ')       // Header cell start
    .replace(/<\/th>/gi, ' ')      // Header cell end
    .replace(/<td>/gi, '| ')       // Data cell start
    .replace(/<\/td>/gi, ' ');     // Data cell end

  /**
   * Processes unordered lists (UL) into Markdown format.
   *
   * @param {RegExp} regex - Regex to match unordered list tags.
   * @param {string} prefix - Prefix for list items.
   */
  function processUnorderedList(regex, prefix) {
    markdownString = markdownString.replace(regex, function (_, innerContent) {
      return innerContent.replace(/<li>(.*?)<\/li>/gi, function (_, itemContent) {
        return `${prefix} ${itemContent.trim()}`;
      });
    });
  }

  /**
   * Processes ordered lists (OL) into Markdown format.
   *
   * @param {RegExp} regex - Regex to match ordered list tags.
   * @param {string} prefix - Prefix for list items (ignored, using numbers instead).
   */
  function processOrderedList(regex, prefix) {
    markdownString = markdownString.replace(regex, function (_, innerContent) {
      let counter = 1;
      return innerContent.replace(/<li>(.*?)<\/li>/gi, function (_, itemContent) {
        return `${counter++}. ${itemContent.trim()}`;
      });
    });
  }
  // Convert UL and OL tags to Markdown lists
  processUnorderedList(/<ul>(.*?)<\/ul>/gis, '-');
  processOrderedList(/<ol>(.*?)<\/ol>/gis, '1.');

  // Remove any remaining HTML tags
  markdownString = markdownString.replace(/<\/?[^>]+(>|$)/g, '');

  // Replace multiple empty lines with a single newline
  markdownString = markdownString.replace(/\n\s*\n+/g, '\n\n');

  // Remove leading and trailing whitespace for each line and ensure a single newline between paragraphs
  markdownString = markdownString.split('\n')
    .map(line => line.trim())
    .join('\n');

  return markdownString;
}

// Post a formatted Discord message the "payload" via WEBHOOK URL
function postDiscord_forums(payload, webhook_url) {
  const discordUrl = webhook_url;
  const params = {
    method: "POST",
    payload: payload,
    muteHttpExceptions: true,
    contentType: "application/json"
  };
  try {
    const response = UrlFetchApp.fetch(discordUrl, params);
  } catch (error) {
    Logger.log(`Error posting to Discord: ${error}`);
  }
}

function constructPayloadForums(topic, forumName) {
  const embed = {
    type: 'rich',
    title: topic.title,
    description: topic.description,
    color: 0xFFF200,
    url: topic.link,
  };

  if (topic.author) {
    embed.author = {
      name: topic.author
    };
  }
  // Validate and set timestamp in ISO 8601 format if available
  if (topic.published) {
    const date = new Date(topic.published);
    if (!isNaN(date.getTime())) {
      embed.timestamp = date.toISOString();
    }
  }
  return JSON.stringify({
    username: forumName,
    avatar_url: 'https://developers.google.com/static/waze/images/logo_waze_color_2x_web_64dp.png',
    content: '',
    tts: false,
    embeds: [embed]
  });
}
