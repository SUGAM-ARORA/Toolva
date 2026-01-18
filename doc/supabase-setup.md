# Supabase Authentication Setup

This project uses **Supabase Auth** for user authentication.
Some authentication-related settings are **managed directly in the Supabase Dashboard**
and therefore **do not appear in the codebase**.

This document explains **what is manual**, **what is automatic**, and **what the project owner needs to configure**.

---

## 🔐 Authentication Flow (How it works)

1. User registers using email + password from the frontend.
2. Supabase automatically creates the user.
3. Supabase sends a **confirmation email** to the user.
4. User must confirm their email before logging in.
5. After confirmation, login works normally.

⚠️ This behavior is intentional and follows Supabase’s default, production-safe flow.

---

## ✉️ Greeting / Confirmation Email (Manual Configuration)

The **greeting / welcome email** sent after registration is handled **entirely by Supabase**.

Because this email is a **platform-level setting**, it:
- ❌ cannot be committed to Git
- ❌ is not part of the frontend or backend code
- ✅ must be configured manually in the Supabase Dashboard

---

## 📍 Where to Configure the Email

Supabase Dashboard
→ Authentication
→ Email Templates
→ Confirm signup


---

## 📧 Email Template (Copy & Paste)

### Subject
```txt
Welcome to Toolva 🎉

<h2>Welcome to Toolva 👋</h2>

<p>Hi {{ .Email }},</p>

<p>
Thank you for registering with <strong>Toolva</strong>.
We’re excited to have you on board 🚀
</p>

<p>
To activate your account, please confirm your email address by clicking the button below:
</p>

<p>
<a href="{{ .ConfirmationURL }}"
   style="display:inline-block;padding:12px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:6px;">
   Confirm Email
</a>
</p>

<p>
If you did not create this account, you can safely ignore this email.
</p>

<p>
— Toolva Team
</p>
