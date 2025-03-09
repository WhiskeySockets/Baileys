# WhatsApp Cloudflare Workers

This project is a modified version of **Baileys WhatsApp**, specifically optimized to run on **Cloudflare Workers**. It allows you to register multiple WhatsApp numbers and send messages to any number efficiently.

## How does it work?

- The system operates **directly on the edge**, using Cloudflare Workers to establish connections with WhatsApp.
- A direct connection is made with the **WhatsApp server WebSocket** and maintained for a short period (between **10 and 50 seconds**).
- This duration is sufficient to **register an account** and obtain the key or to **send messages**.
- After this period, the connection is closed, ensuring **efficient resource consumption** and **significant processing savings**.

## Scalability

- **Scalability tests have not yet been conducted**.
- It is suspected that message sending will be managed through a **queue system**, rather than horizontal scalability.

This approach aims to keep the system lightweight and efficient without requiring persistent connections.

### Page to register multiple WhatsApp accounts
![image](https://github.com/user-attachments/assets/60cc8478-1c25-4ec0-b89a-7eaea2d16442)

### Generate QR Code
![image](https://github.com/user-attachments/assets/a7c387b6-83e9-4bcd-bcaf-496102da9622)

### Page to send message
![image](https://github.com/user-attachments/assets/0200d4c4-b45c-4708-8ed0-9f1a80d5393d)

## How to Set Up and Run the Project

### 1. Clone the Repository
```sh
git clone https://github.com/rafaelsg-01/whatsapp-cloudflare-workers.git
cd whatsapp-cloudflare-workers
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Run the Local Server
```sh
wrangler dev
```
The server will be available at: [http://127.0.0.1:8787](http://127.0.0.1:8787)

---

## UserBot Registration
Choose a name for your **UserBot**, using only characters from `a-z`, `A-Z` and `0-9`.

The default admin password is **`123456`**, and it can be changed in the file:
```ts
/Example/example.ts
```
In the variable:
```ts
const PASSWORD_ADMIN = "123456";
```

### 1. Connect to WhatsApp
1. Access the main page.
2. Fill in the `UserBot` and `Admin Password` fields.
3. Click the blue **"Generate QR Code"** button.
4. Scan the QR Code with WhatsApp on your phone **as quickly as possible** to avoid errors.
5. Wait **30 seconds** for the UserBot to appear in the list.

### 2. Test Message Sending
1. Go to the **Send Message** page by clicking the green **"Go to Send Message"** button.
2. Fill in the following fields:
   - **UserBot** (the one you just created)
   - **Phone number (destination)**
   - **Message**
   - **Admin Password**
3. Click **"Send Message"** and if everything is correct, the message will be sent!

---

This project is also available via npm:
```sh
npm i whatsapp-cloudflare-workers
```

If you have any questions or need help, feel free to open an issue or contribute with improvements!
