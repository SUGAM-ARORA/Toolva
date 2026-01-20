# Supabase Authentication Setup

This project uses **Supabase Auth** for user authentication.
Some authentication-related settings are **managed directly in the Supabase Dashboard**
and therefore **do not appear in the codebase**.

This document explains what is automatic, what is manual, and what the project owner must configure.

---

When a user registers using email and password from the frontend, Supabase automatically creates the user and sends a **confirmation email**.  
The user must confirm their email before logging in. This is Supabase’s default and recommended production flow.

---

## Greeting / Confirmation Email Setup

The greeting / welcome email sent after signup is **not handled in backend or frontend code**.
It is configured manually inside the **Supabase Dashboard** and cannot be committed to Git.

**Location in Supabase Dashboard:**

Authentication → Email Templates → Confirm signup

---

Below is the **exact email content** to paste in Supabase.

### Subject
```txt
Welcome to Toolva 🎉
```

### Body (HTML)
```html
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
