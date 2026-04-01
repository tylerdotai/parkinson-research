# Email Setup Guide

This guide explains how to configure the Parkinson's Research Agent to send daily reports via email.

## Option 1: iCloud SMTP (Default)

### Generate an App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Navigate to **Sign-In and Security** → **App-Specific Passwords**
4. Click **+** to generate a new password
5. Name it something like "Parkinson Research Agent"
6. Copy the generated password

### Save to Keychain (macOS)

```bash
security add-generic-password -s "icloud-parkinson-agent" -a "your@icloud.com" -w "your-app-specific-password"
```

### Configure himalaya

```bash
mkdir -p ~/.config/himalaya
cat > ~/.config/himalaya/account.toml << 'EOF'
[[accounts]]
name = "icloud"
email = "your@icloud.com"
display_name = "Parkinson Research Agent"

[accounts.icloud.smtp]
host = "smtp.mail.me.com"
port = 465
username = "your@icloud.com"
password = "your-app-specific-password"
tls = true
tls_autostart = true
EOF
```

### Test Email

```bash
curl -s --url "smtps://smtp.mail.me.com:465" \
  --user "your@icloud.com:your-app-specific-password" \
  --mail-from "your@icloud.com" \
  --mail-rcpt "subscriber@example.com" \
  --upload-file /tmp/test_email.txt
```

## Option 2: Gmail SMTP

### Generate an App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification** (must be enabled)
3. Go to **App passwords**
4. Generate a new password for "Mail"
5. Copy the 16-character password

### Configure himalaya

```toml
[[accounts]]
name = "gmail"
email = "your@gmail.com"
display_name = "Parkinson Research Agent"

[accounts.gmail.smtp]
host = "smtp.gmail.com"
port = 465
username = "your@gmail.com"
password = "your-app-password"
tls = true
tls_autostart = true
```

### Send Test Email

```bash
curl -s --url "smtps://smtp.gmail.com:465" \
  --user "your@gmail.com:your-app-password" \
  --mail-from "your@gmail.com" \
  --mail-rcpt "subscriber@example.com" \
  --upload-file /tmp/test_email.txt
```

## Option 3: Resend (Recommended for Bulk)

[Resend](https://resend.com) is a transactional email API that's free for 100 emails/day.

1. Sign up at [resend.com](https://resend.com)
2. Add a domain or use `resend.dev` for testing
3. Create an API key
4. Install the SDK: `npm install resend`

### Example Resend Script

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_your_api_key');

await resend.emails.send({
  from: 'Parkinson Research <onboarding@resend.dev>',
  to: 'subscriber@example.com',
  subject: `Parkinson's Research Daily — ${new Date().toLocaleDateString()}`,
  text: reportContent,
});
```

## Updating the Cron

To change the email recipient or SMTP settings, update the OpenClaw cron:

```bash
openclaw cron edit <cron-id> --message "...your updated message..."
```

The email send command in the cron uses curl with SMTP:

```bash
curl -s --url "smtps://smtp.mail.me.com:465" \
  --user "your@email.com:$(security find-generic-password -s 'your-keychain-entry' -w)" \
  --mail-from "your@email.com" \
  --mail-rcpt "recipient@email.com" \
  --upload-file /path/to/report.md
```

## Troubleshooting

### "Authentication failed"
- Double-check your app password is correct
- Ensure 2FA is enabled on your email account
- For iCloud, make sure "Allow less secure apps" isn't blocking (use app-specific passwords only)

### "Connection timed out"
- Check your network/firewall settings
- Try port 587 (STARTTLS) instead of 465 (TLS)
- Some corporate networks block SMTP

### "Email going to spam"
- Add the sending address to your contacts
- Set up SPF/DKIM records if sending from a custom domain
- Use a recognized sender name (not just an IP address)

## Privacy Note

This agent sends emails containing Parkinson's research information. No personal health data is collected or transmitted. All reports are generated from publicly available research and contain no patient-specific information.
