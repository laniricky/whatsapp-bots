const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("QR code received, scan it with your WhatsApp app.");
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Function to download TikTok video with headers to mimic a browser
async function downloadTikTokVideo(url, outputPath) {
    return new Promise((resolve, reject) => {
        const command = `yt-dlp -o "${outputPath}" --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0" --referer "https://www.instagram.com" ${url}`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Error downloading video:", stderr || error);
                reject(stderr || error);
            } else {
                console.log("Video downloaded successfully:", stdout);
                resolve(outputPath);
            }
        });
    });
}

// Listen for incoming messages
client.on('message', async (message) => {
    const url = message.body;
    if (url.startsWith('https://www.instagram.com/')) {
        const outputPath = path.join(__dirname, 'videos', `IG_video_${Date.now()}.mp4`);
        
        try {
            // Ensure the videos directory exists
            if (!fs.existsSync(path.join(__dirname, 'videos'))) {
                fs.mkdirSync(path.join(__dirname, 'videos'));
            }

            await client.sendMessage(message.from, "Starting download for your Instagram  video... ⏳");
            
            // Download the TikTok video
            await downloadTikTokVideo(url, outputPath);
            await client.sendMessage(message.from, "Download completed! Preparing to send the video...");

            // Check if the file exists before sending
            if (fs.existsSync(outputPath)) {
                // Read the file and create a MessageMedia instance
                const media = MessageMedia.fromFilePath(outputPath);
                
                // Send the video as a media message
                await client.sendMessage(message.from, media, { sendMediaAsDocument: true });
                await client.sendMessage(message.from, "Here’s your Instagram video! 🎉");
            } else {
                console.error("Video file not found at:", outputPath);
                await message.reply("Sorry, there was an issue locating the downloaded video file 🥹.");
            }
            
        } catch (error) {
            console.error("Failed to download or send the video:", error);
            await message.reply("Sorry, there was an issue downloading the video 🥹.");
        }
    }
});

// Start the client
client.initialize();

