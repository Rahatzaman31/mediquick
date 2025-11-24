import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://localhost:5000'] : [])
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-password']
}));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const frontendURL = process.env.FRONTEND_URL || 'https://mediquick-two.vercel.app';

function getBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  if (process.env.REPLIT_DOMAINS) {
    return `https://${process.env.REPLIT_DOMAINS}`;
  }
  return 'http://localhost:5000';
}

function validateAdminAuth(req, res, next) {
  const adminPassword = req.headers['x-admin-password'];
  
  if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }
  
  next();
}

async function createEmailTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail credentials not configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'banners');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

app.use(express.json());
app.use('/banners', express.static(path.join(__dirname, 'public', 'banners')));

app.post('/api/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured in environment variables');
      return res.status(500).json({ error: 'Admin login not configured' });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({ 
        success: true, 
        message: 'Admin login successful',
        admin: {
          username: ADMIN_USERNAME
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Admin login failed' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate email domain - only allow Gmail and Hotmail
    const emailLower = email.toLowerCase();
    const allowedDomains = ['@gmail.com', '@hotmail.com'];
    const isAllowedDomain = allowedDomains.some(domain => emailLower.endsWith(domain));
    
    if (!isAllowedDomain) {
      return res.status(400).json({ error: 'Only Gmail and Hotmail addresses are allowed for sign up' });
    }
    
    // Block temporary/disposable email services
    const tempEmailDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
      'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
      'trashmail.com', 'yopmail.com', 'mohmal.com', 'fakeinbox.com',
      'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
      'spam4.me', 'mintemail.com', 'emailondeck.com', 'tempinbox.com',
      'dispostable.com', 'throwawaymail.com', 'mytemp.email', 'temp-mail.io',
      'tmailor.com', 'tmails.net', 'disposablemail.com', 'getairmail.com',
      'harakirimail.com', 'mail-temp.com', 'tempmail.net', '33mail.com',
      'mailnesia.com', 'mailcatch.com', 'tmail.com', 'email-temp.com'
    ];
    
    const emailDomain = emailLower.split('@')[1];
    if (tempEmailDomains.includes(emailDomain)) {
      return res.status(400).json({ error: 'Temporary email addresses are not allowed' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: email,
        name: '',
        password_hash: hashedPassword,
        status: 'active',
        points: 0,
        profile_complete: false,
        email_verified: true,
        join_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return res.status(500).json({ error: 'Failed to create user account' });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ USER ACCOUNT CREATED (NO EMAIL VERIFICATION REQUIRED)');
    console.log('='.repeat(80));
    console.log('📧 Email:', email);
    console.log('👤 User ID:', newUser.id);
    console.log('📝 Profile Complete:', newUser.profile_complete);
    console.log('✉️ Email Verified:', newUser.email_verified);
    console.log('='.repeat(80) + '\n');

    res.json({ 
      success: true, 
      message: 'Account created successfully! Please complete your profile.',
      user: {
        id: newUser.id,
        email: newUser.email,
        profile_complete: newUser.profile_complete,
        email_verified: newUser.email_verified,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Password not set. Please use forgot password to set a new password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        email_verified: false,
        email: email
      });
    }

    const { password_hash, ...sanitizedUser } = user;
    res.json({ success: true, user: sanitizedUser });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'An error occurred during signin' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and OTP are required' 
      });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email_verified')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(400).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    if (user.email_verified) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already verified. You can login now.' 
      });
    }

    const { data: verificationToken, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('token', otp)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !verificationToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid OTP code' 
      });
    }

    if (new Date(verificationToken.expires_at) < new Date()) {
      return res.status(400).json({ 
        success: false,
        error: 'This OTP code has expired. Please request a new one.' 
      });
    }

    const { error: updateUserError } = await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', user.id);

    if (updateUserError) {
      console.error('Error verifying user:', updateUserError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to verify email' 
      });
    }

    await supabase
      .from('email_verification_tokens')
      .update({ used: true })
      .eq('id', verificationToken.id);

    const { data: verifiedUser, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userFetchError || !verifiedUser) {
      console.error('Error fetching verified user:', userFetchError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve user data' 
      });
    }

    console.log('✅ Email verified successfully via OTP for user ID:', user.id);

    // Send welcome notification to user about email verification
    try {
      const notificationData = {
        user_id: user.id,
        type: 'account',
        title: 'Email Verified - Welcome!',
        message: 'Your email has been verified successfully! Welcome to MediQuick. You can now book appointments and access all our services.',
        is_read: false,
        created_at: new Date().toISOString(),
        request_id: `email_verified_${user.id}`,
        request_type: 'account'
      };
      await supabase.from('notifications').insert([notificationData]);
      console.log('Email verification notification sent to user:', user.id);
    } catch (notifError) {
      console.error('Error sending email verification notification:', notifError);
    }

    const { password_hash, ...sanitizedUser } = verifiedUser;

    res.json({ 
      success: true, 
      message: 'Email verified successfully!',
      user: sanitizedUser
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred during verification' 
    });
  }
});

app.get('/api/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { data: verificationToken, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', tokenHash)
      .single();

    if (tokenError || !verificationToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid verification token' 
      });
    }

    if (verificationToken.used) {
      return res.status(400).json({ 
        success: false,
        error: 'This verification link has already been used' 
      });
    }

    if (new Date(verificationToken.expires_at) < new Date()) {
      return res.status(400).json({ 
        success: false,
        error: 'This verification link has expired. Please request a new one.' 
      });
    }

    const { error: updateUserError } = await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', verificationToken.user_id);

    if (updateUserError) {
      console.error('Error verifying user:', updateUserError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to verify email' 
      });
    }

    await supabase
      .from('email_verification_tokens')
      .update({ used: true })
      .eq('token', tokenHash);

    const { data: verifiedUser, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', verificationToken.user_id)
      .single();

    if (userFetchError || !verifiedUser) {
      console.error('Error fetching verified user:', userFetchError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve user data' 
      });
    }

    console.log('✅ Email verified successfully for user ID:', verificationToken.user_id);

    const { password_hash, ...sanitizedUser } = verifiedUser;

    res.json({ 
      success: true, 
      message: 'Email verified successfully! Redirecting to profile creation...',
      user: sanitizedUser
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred during verification' 
    });
  }
});

app.post('/api/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, email_verified')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a verification code has been sent.' 
      });
    }

    if (user.email_verified) {
      return res.status(400).json({ 
        error: 'This email is already verified. You can login now.' 
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: insertError } = await supabase
      .from('email_verification_tokens')
      .insert({
        user_id: user.id,
        token: otp,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (insertError) {
      console.error('Error creating verification OTP:', insertError);
      return res.status(500).json({ error: 'Failed to create verification OTP' });
    }

    console.log('\n' + '='.repeat(80));
    console.log('🔄 RESEND OTP VERIFICATION REQUEST');
    console.log('='.repeat(80));
    console.log('📧 Email:', email);
    console.log('👤 User ID:', user.id);
    console.log('🔢 OTP Code:', otp);
    console.log('⏰ Expires:', expiresAt.toLocaleString());
    console.log('='.repeat(80) + '\n');

    const { data: emailSettings } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    const senderName = emailSettings?.sender_name || 'MediQuick';
    const supportEmail = emailSettings?.support_email || 'support@mediquick.com';
    const emailFooterText = emailSettings?.email_footer_text || 'MediQuick - Your Trusted Healthcare Platform';

    try {
      const transporter = await createEmailTransporter();

      await transporter.sendMail({
        from: `"${senderName}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your Verification Code - ${senderName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #673AB7;
              }
              .header h1 {
                color: #673AB7;
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 30px 0;
              }
              .otp-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
                font-family: 'Courier New', monospace;
              }
              .footer {
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
              }
              .info-box {
                background: #E8EAF6;
                border-left: 4px solid #673AB7;
                padding: 12px;
                margin: 15px 0;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✉️ Verify Your Email</h1>
              </div>
              <div class="content">
                <p>Hello ${user.name || 'there'},</p>
                <p>You requested a new verification code for your ${senderName} account. Please enter the code below in the app:</p>
                <div class="otp-box">${otp}</div>
                <div class="info-box">
                  ℹ️ <strong>Important Information:</strong>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    <li>This code expires in 10 minutes</li>
                    <li>You must verify your email before you can login</li>
                    <li>You can only use this code once</li>
                    <li>Never share this code with anyone</li>
                  </ul>
                </div>
                <p>If you didn't request this verification code, you can safely ignore this message.</p>
              </div>
              <div class="footer">
                <p>This is an automated email from ${senderName}. Please do not reply to this email.</p>
                <p>If you need help, please contact our support team at ${supportEmail}</p>
                <p style="margin-top: 15px; font-style: italic;">${emailFooterText}</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      console.log('✅ OTP resent successfully via Gmail to:', email);
    } catch (emailError) {
      console.warn('⚠️ Failed to send email (OTP code is above):', emailError.message);
    }

    res.json({ 
      success: true, 
      message: 'If an account with that email exists, a verification code has been sent.' 
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking user:', userError);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'No account found with this email address. Please check your email or sign up for a new account.' 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a unique token for this reset request (still needed for session tracking)
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // OTP expires in 15 minutes (more appropriate for OTP)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const { error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token: tokenHash,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        used: false,
        otp_verified: false,
        verification_attempts: 0
      });

    if (insertError) {
      console.error('Error creating reset token:', insertError);
      return res.status(500).json({ error: 'Failed to create reset token' });
    }

    console.log('\n' + '='.repeat(80));
    console.log('🔐 PASSWORD RESET REQUEST (OTP)');
    console.log('='.repeat(80));
    console.log('📧 Email:', email);
    console.log('👤 User:', user.name || 'Not set');
    console.log('🔢 OTP Code:', otp);
    console.log('⏰ Expires:', expiresAt.toLocaleString());
    console.log('='.repeat(80) + '\n');

    const { data: emailSettings } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    const senderName = emailSettings?.sender_name || 'MediQuick';
    const passwordResetSubject = emailSettings?.password_reset_subject || 'Your Password Reset Code - MediQuick';
    const passwordResetEnabled = emailSettings?.password_reset_enabled !== false;
    const emailFooterText = emailSettings?.email_footer_text || 'MediQuick - Your Trusted Healthcare Platform';
    const supportEmail = emailSettings?.support_email || 'support@mediquick.com';

    if (!passwordResetEnabled) {
      console.log('⚠️ Password reset emails are disabled in settings');
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a verification code has been sent.' 
      });
    }

    try {
      const transporter = await createEmailTransporter();

      await transporter.sendMail({
        from: `"${senderName}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: passwordResetSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #673AB7;
              }
              .header h1 {
                color: #673AB7;
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 30px 0;
              }
              .otp-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-align: center;
                padding: 30px;
                border-radius: 12px;
                margin: 25px 0;
              }
              .otp-code {
                font-size: 42px;
                font-weight: 700;
                letter-spacing: 8px;
                margin: 10px 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
              }
              .otp-label {
                font-size: 14px;
                opacity: 0.9;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .footer {
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
              }
              .warning {
                background: #FFF3E0;
                border-left: 4px solid #FF9800;
                padding: 12px;
                margin: 15px 0;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Code</h1>
              </div>
              <div class="content">
                <p>Hi ${user.name || 'there'},</p>
                <p>You requested to reset your password for your ${senderName} account.</p>
                <p>Use the following verification code to complete your password reset:</p>
                <div class="otp-box">
                  <div class="otp-label">Your Verification Code</div>
                  <div class="otp-code">${otp}</div>
                </div>
                <div class="warning">
                  ⚠️ <strong>Important:</strong>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    <li>This code expires in 15 minutes</li>
                    <li>You can only use this code once</li>
                    <li>Never share this code with anyone</li>
                    <li>Enter this code in the application to reset your password</li>
                  </ul>
                </div>
                <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              </div>
              <div class="footer">
                <p>This is an automated email from ${senderName}. Please do not reply to this email.</p>
                <p>If you need help, please contact our support team at ${supportEmail}</p>
                <p style="margin-top: 15px; font-style: italic;">${emailFooterText}</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      console.log('✅ Password reset OTP email sent successfully via Gmail to:', email);
    } catch (emailError) {
      console.warn('⚠️ Failed to send email (OTP code is above):', emailError.message);
    }

    res.json({ 
      success: true, 
      message: 'If an account with that email exists, a verification code has been sent.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Verify Password Reset OTP endpoint
app.post('/api/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format. OTP must be 6 digits.' });
    }

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    // Get the most recent reset token for this user
    const { data: resetTokens, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (tokenError || !resetTokens || resetTokens.length === 0) {
      return res.status(400).json({ error: 'No valid reset request found. Please request a new OTP.' });
    }

    const resetToken = resetTokens[0];

    // Check if token has expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check if already verified
    if (resetToken.otp_verified) {
      return res.status(400).json({ error: 'This OTP has already been verified.' });
    }

    // Check verification attempts (max 5 attempts)
    if (resetToken.verification_attempts >= 5) {
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (resetToken.otp_code !== otp) {
      // Increment verification attempts
      await supabase
        .from('password_reset_tokens')
        .update({ verification_attempts: resetToken.verification_attempts + 1 })
        .eq('id', resetToken.id);

      const remainingAttempts = 5 - (resetToken.verification_attempts + 1);
      return res.status(400).json({ 
        error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.` 
      });
    }

    // OTP is valid! Mark as verified
    await supabase
      .from('password_reset_tokens')
      .update({ otp_verified: true })
      .eq('id', resetToken.id);

    console.log('\n' + '='.repeat(80));
    console.log('✅ OTP VERIFIED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log('📧 Email:', email);
    console.log('👤 User:', user.name || 'Not set');
    console.log('🔢 OTP:', otp);
    console.log('='.repeat(80) + '\n');

    res.json({ 
      success: true, 
      message: 'OTP verified successfully. You can now reset your password.',
      resetToken: resetToken.token
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'An error occurred during verification' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword, email } = req.body;

    if ((!token && !email) || !newPassword) {
      return res.status(400).json({ error: 'Email/token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    let resetToken;

    if (email) {
      // OTP-based reset: find by email and verify OTP was verified
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return res.status(400).json({ error: 'Invalid email' });
      }

      const { data: resetTokens, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('used', false)
        .eq('otp_verified', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (tokenError || !resetTokens || resetTokens.length === 0) {
        return res.status(400).json({ error: 'Please verify your OTP first' });
      }

      resetToken = resetTokens[0];
    } else {
      // Legacy token-based reset (for backward compatibility)
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const { data: tokenData, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', tokenHash)
        .single();

      if (tokenError || !tokenData) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      resetToken = tokenData;
    }

    if (resetToken.used) {
      return res.status(400).json({ error: 'This reset request has already been used' });
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This reset request has expired' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', resetToken.user_id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    // Mark the reset token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', resetToken.id);

    // Send notification to user about password reset
    try {
      const notificationData = {
        user_id: resetToken.user_id,
        type: 'account',
        title: 'Password Reset Successful',
        message: 'Your password has been reset successfully. If this wasn\'t you, please contact support immediately.',
        is_read: false,
        created_at: new Date().toISOString(),
        request_id: `password_reset_${resetToken.user_id}`,
        request_type: 'account'
      };
      await supabase.from('notifications').insert([notificationData]);
      console.log('Password reset notification sent to user:', resetToken.user_id);
    } catch (notifError) {
      console.error('Error sending password reset notification:', notifError);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ PASSWORD RESET SUCCESSFUL');
    console.log('='.repeat(80));
    console.log('👤 User ID:', resetToken.user_id);
    console.log('🔒 Password updated successfully');
    console.log('='.repeat(80) + '\n');

    res.json({ success: true, message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', tokenHash)
      .single();

    if (tokenError || !resetToken) {
      return res.json({ valid: false, message: 'Invalid reset token' });
    }

    if (resetToken.used) {
      return res.json({ valid: false, message: 'This reset link has already been used' });
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return res.json({ valid: false, message: 'This reset link has expired' });
    }

    res.json({ valid: true });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ valid: false, message: 'An error occurred' });
  }
});

app.post('/api/upload-banner', validateAdminAuth, upload.single('bannerImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/banners/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.delete('/api/delete-banner/:filename', validateAdminAuth, (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const bannersDir = path.join(__dirname, 'public', 'banners');
    const filePath = path.join(bannersDir, filename);
    
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(bannersDir)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Change password endpoint
app.post('/api/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        error: 'New password must be at least 8 characters' 
      });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Send notification to user about password change
    try {
      const notificationData = {
        user_id: userId,
        type: 'account',
        title: 'Password Changed',
        message: 'Your password has been changed successfully. If this wasn\'t you, please contact support immediately.',
        is_read: false,
        created_at: new Date().toISOString(),
        request_id: `password_change_${userId}`,
        request_type: 'account'
      };
      await supabase.from('notifications').insert([notificationData]);
      console.log('Password change notification sent to user:', userId);
    } catch (notifError) {
      console.error('Error sending password change notification:', notifError);
    }

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to change password' 
    });
  }
});

// ============= BKASH PAYMENT GATEWAY =============

// bKash configuration - using environment variables or defaults for sandbox
const getBkashConfig = async () => {
  try {
    const { data: config, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('provider', 'bkash')
      .single();

    if (error) {
      console.log('Error fetching bKash config from database:', error.message);
    }

    if (config && config.is_active) {
      console.log('Using bKash config from database - Sandbox:', config.is_sandbox, 'Active:', config.is_active);
      return {
        baseURL: config.is_sandbox 
          ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
          : 'https://tokenized.pay.bka.sh/v1.2.0-beta',
        username: config.username,
        password: config.password,
        app_key: config.app_key,
        app_secret: config.app_secret,
        is_sandbox: config.is_sandbox
      };
    } else if (config) {
      console.log('bKash config found in database but is_active is false');
    }
  } catch (error) {
    console.log('Exception fetching bKash config from database:', error.message);
  }

  // Default sandbox credentials
  console.log('Using default bKash sandbox credentials');
  return {
    baseURL: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    username: 'sandboxTokenizedUser02',
    password: 'sandboxTokenizedUser02@12345',
    app_key: '4f6o0cjiki2rfm34kfdadl1eqq',
    app_secret: '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
    is_sandbox: true
  };
};

// Grant bKash token
async function grantBkashToken() {
  const config = await getBkashConfig();
  
  console.log('Requesting bKash token from:', config.baseURL);
  console.log('Using credentials - Username:', config.username, 'App Key:', config.app_key?.substring(0, 10) + '...');
  
  try {
    const response = await fetch(`${config.baseURL}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'username': config.username,
        'password': config.password
      },
      body: JSON.stringify({
        app_key: config.app_key,
        app_secret: config.app_secret
      })
    });

    const data = await response.json();
    
    console.log('bKash token response status:', response.status);
    console.log('bKash token response data:', JSON.stringify(data));
    
    if (!response.ok) {
      const errorMsg = data.statusMessage || data.errorMessage || 'Failed to get bKash token';
      console.error('bKash API error response:', data);
      throw new Error(errorMsg);
    }

    if (!data.id_token) {
      console.error('No id_token in bKash response:', data);
      throw new Error('No id_token received from bKash');
    }

    console.log('bKash token granted successfully');
    return data.id_token;
  } catch (error) {
    console.error('bKash token grant error:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

// Create bKash payment
app.post('/api/bkash/create-payment', async (req, res) => {
  try {
    const { amount, invoiceNumber, userId } = req.body;

    if (!amount || !invoiceNumber) {
      return res.status(400).json({ error: 'Amount and invoice number are required' });
    }

    const config = await getBkashConfig();
    const token = await grantBkashToken();

    const callbackURL = `${req.protocol}://${req.get('host')}/api/bkash/callback`;

    const response = await fetch(`${config.baseURL}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
        'x-app-key': config.app_key
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: ' ',
        callbackURL: callbackURL,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceNumber
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.statusMessage || 'Failed to create payment');
    }

    // Check if bKash returned an error (even with HTTP 200)
    if (data.statusMessage && !data.paymentID) {
      throw new Error(data.statusMessage);
    }

    if (!data.bkashURL || !data.paymentID) {
      throw new Error('Invalid response from bKash');
    }

    res.json({ 
      success: true, 
      paymentID: data.paymentID,
      bkashURL: data.bkashURL,
      statusMessage: data.statusMessage
    });

  } catch (error) {
    console.error('bKash create payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create payment' 
    });
  }
});

// Execute bKash payment
app.post('/api/bkash/execute-payment', async (req, res) => {
  try {
    const { paymentID } = req.body;

    if (!paymentID) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const config = await getBkashConfig();
    const token = await grantBkashToken();

    const response = await fetch(`${config.baseURL}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
        'x-app-key': config.app_key
      },
      body: JSON.stringify({
        paymentID: paymentID
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.statusMessage || 'Failed to execute payment');
    }

    res.json({ 
      success: true, 
      data: data
    });

  } catch (error) {
    console.error('bKash execute payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to execute payment' 
    });
  }
});

// Query bKash payment status
app.get('/api/bkash/query-payment/:paymentID', async (req, res) => {
  try {
    const { paymentID } = req.params;

    const config = await getBkashConfig();
    const token = await grantBkashToken();

    const response = await fetch(`${config.baseURL}/tokenized/checkout/payment/status?paymentID=${paymentID}`, {
      method: 'GET',
      headers: {
        'authorization': token,
        'x-app-key': config.app_key
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.statusMessage || 'Failed to query payment');
    }

    res.json({ 
      success: true, 
      data: data
    });

  } catch (error) {
    console.error('bKash query payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to query payment' 
    });
  }
});

// bKash callback handler
app.get('/api/bkash/callback', async (req, res) => {
  try {
    const { paymentID, status } = req.query;
    
    console.log('bKash callback received:', { paymentID, status });
    
    // Redirect to frontend with payment result
    const redirectURL = `${frontendURL}/bkash-payment-result.html?paymentID=${paymentID}&status=${status}`;
    console.log('Redirecting to:', redirectURL);
    
    res.redirect(redirectURL);
  } catch (error) {
    console.error('bKash callback error:', error);
    // Even if there's an error, try to redirect to frontend with error status
    const redirectURL = `${frontendURL}/bkash-payment-result.html?status=error`;
    res.redirect(redirectURL);
  }
});

// Admin: Get bKash credentials
app.get('/api/admin/bkash-config', validateAdminAuth, async (req, res) => {
  try {
    const { data: config } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('provider', 'bkash')
      .single();

    if (config) {
      // Don't send sensitive data to frontend, only status
      res.json({
        success: true,
        config: {
          is_active: config.is_active,
          is_sandbox: config.is_sandbox,
          username: config.username ? '***' : '',
          hasCredentials: !!(config.app_key && config.app_secret)
        }
      });
    } else {
      res.json({
        success: true,
        config: {
          is_active: false,
          is_sandbox: true,
          username: '',
          hasCredentials: false
        }
      });
    }
  } catch (error) {
    console.error('Get bKash config error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get bKash configuration' 
    });
  }
});

// Admin: Update bKash credentials
app.post('/api/admin/bkash-config', validateAdminAuth, async (req, res) => {
  try {
    const { username, password, app_key, app_secret, is_sandbox, is_active } = req.body;

    if (!username || !password || !app_key || !app_secret) {
      return res.status(400).json({ 
        error: 'All credentials are required (username, password, app_key, app_secret)' 
      });
    }

    // Check if config exists
    const { data: existingConfig } = await supabase
      .from('payment_settings')
      .select('id')
      .eq('provider', 'bkash')
      .single();

    let result;
    if (existingConfig) {
      // Update existing config
      result = await supabase
        .from('payment_settings')
        .update({
          username,
          password,
          app_key,
          app_secret,
          is_sandbox: is_sandbox !== undefined ? is_sandbox : true,
          is_active: is_active !== undefined ? is_active : true,
          updated_at: new Date().toISOString()
        })
        .eq('provider', 'bkash');
    } else {
      // Insert new config
      result = await supabase
        .from('payment_settings')
        .insert({
          provider: 'bkash',
          username,
          password,
          app_key,
          app_secret,
          is_sandbox: is_sandbox !== undefined ? is_sandbox : true,
          is_active: is_active !== undefined ? is_active : true
        });
    }

    if (result.error) {
      throw result.error;
    }

    res.json({ 
      success: true, 
      message: 'bKash credentials updated successfully' 
    });

  } catch (error) {
    console.error('Update bKash config error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update bKash configuration' 
    });
  }
});

// Admin: Get bKash Send Money settings
app.get('/api/admin/bkash-send-money-settings', validateAdminAuth, async (req, res) => {
  try {
    const { data: settings } = await supabase
      .from('bkash_send_money_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (settings) {
      res.json({
        success: true,
        settings: {
          account_number: settings.account_number,
          account_name: settings.account_name,
          instructions: settings.instructions,
          is_active: settings.is_active
        }
      });
    } else {
      res.json({
        success: true,
        settings: {
          account_number: '01750123456',
          account_name: 'MediQuick Healthcare Ltd.',
          instructions: '1. Open your bKash app and select "Send Money"\n2. Enter our account number: 01750123456\n3. Enter the payment amount\n4. Complete the payment and note down the Transaction ID\n5. Enter the Transaction ID below to confirm your payment',
          is_active: true
        }
      });
    }
  } catch (error) {
    console.error('Get bKash Send Money settings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get bKash Send Money settings' 
    });
  }
});

// Admin: Update bKash Send Money settings
app.post('/api/admin/bkash-send-money-settings', validateAdminAuth, async (req, res) => {
  try {
    const { account_number, account_name, instructions, is_active } = req.body;

    if (!account_number || !account_name) {
      return res.status(400).json({ 
        error: 'Account number and account name are required' 
      });
    }

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('bkash_send_money_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    let result;
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('bkash_send_money_settings')
        .update({
          account_number,
          account_name,
          instructions,
          is_active: is_active !== undefined ? is_active : true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id);
    } else {
      // Insert new settings
      result = await supabase
        .from('bkash_send_money_settings')
        .insert({
          account_number,
          account_name,
          instructions,
          is_active: is_active !== undefined ? is_active : true
        });
    }

    if (result.error) {
      throw result.error;
    }

    res.json({ 
      success: true, 
      message: 'bKash Send Money settings updated successfully' 
    });

  } catch (error) {
    console.error('Update bKash Send Money settings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update bKash Send Money settings' 
    });
  }
});

// Public API: Get bKash Send Money settings (for user application)
app.get('/api/bkash-send-money-settings', async (req, res) => {
  try {
    const { data: settings } = await supabase
      .from('bkash_send_money_settings')
      .select('account_number, account_name, instructions, is_active')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (settings) {
      res.json({
        success: true,
        settings: settings
      });
    } else {
      // Return default settings if none configured
      res.json({
        success: true,
        settings: {
          account_number: '01750123456',
          account_name: 'MediQuick Healthcare Ltd.',
          instructions: '1. Open your bKash app and select "Send Money"\n2. Enter our account number: 01750123456\n3. Enter the payment amount\n4. Complete the payment and note down the Transaction ID\n5. Enter the Transaction ID below to confirm your payment',
          is_active: true
        }
      });
    }
  } catch (error) {
    console.error('Public get bKash Send Money settings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get bKash Send Money settings' 
    });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare API Server', 
    status: 'running',
    endpoints: {
      admin: '/api/admin-login',
      users: '/api/*',
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend API Server running at http://0.0.0.0:${PORT}/`);
    console.log(`📡 Ready to accept requests from frontend`);
    console.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
});