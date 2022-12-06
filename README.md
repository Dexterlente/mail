# Email

### Emailing System 
Developed in python django for the backend and vanilla javascript for the front end
***
+ Emailing System Features
    - Send Mail: When a user submits the email composition form, add JavaScript code to actually send the email.
    - Mailbox: When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
    - View Email: When a user clicks on an email, the user should be taken to a view where they see the content of that email.
    - Archive and Unarchive: Allow users to archive and unarchive emails that they have received.
    - Reply: Allow users to reply to an email.
 ##### All rendered in Javascript for faster loading times.
***
#### models.py
- `User` - model which uses Django Abstractuser Extension
- `Email` - The model that has been serialize to be an API for the emailing System
