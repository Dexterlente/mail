document.addEventListener('DOMContentLoaded', function() {
    if(sessionStorage.getItem('mail') !== null) {
      (sessionStorage.getItem('mail')); //hereeeeeeeeeeeeeeeeeeeeee
  }
  console.log(sessionStorage)

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', send_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-contents').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-contents').style.display = 'block';
  
      document.querySelector('#email-contents').innerHTML = `
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>From:</b> ${email.sender} </li>
        <li class="list-group-item"><b>To:</b> ${email.recipients}</li>
        <li class="list-group-item"><b>Subject:</b> ${email.subject}</li>
        <li class="list-group-item"><b>Timestamp:</b> ${email.timestamp}</li>
        <li class="list-group-item py-5">${email.body} </li>
      </ul>
      `
      //hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      sessionStorage.setItem('mail', JSON.stringify(email));
      console.log(mail)
      console.log(JSON.stringify(mail))
      console.log(sessionStorage.getItem('mail'));
      document.getElementById('email-contents').innerHTML=sessionStorage.getItem('mail');

      if (!email.read){
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
      }
      // archive
      const archiveButton = document.createElement('button');
      archiveButton.innerHTML = email.archived ? "Unarchive" : "Archive";
      archiveButton.className = email.archived ? "btn btn-success" : "btn btn-danger";
      archiveButton.addEventListener('click', function() {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: !email.archived
          })
        })
        .then(() => { load_mailbox('archive')})
      });
      document.querySelector('#email-contents').append(archiveButton);

      // reply email
      const replyButton = document.createElement('button');
      replyButton.innerHTML = "Reply"
      replyButton.className =  "btn btn-primary";
      replyButton.addEventListener('click', function() {
        compose_email();

        document.querySelector('#compose-recipients').value = email.sender;
        let subject = email.subject;
        if (subject.split(" ", 1)[0] != "Re:") {
          subject = "Re: " + subject;
        }
        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
      
      });

      document.querySelector('#email-contents').append(replyButton);


  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-contents').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // get logged user messages
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // loop foreach email messages
    emails.forEach(newMessage => {
      console.log(newMessage);
        // create divs for each messages
      const makeMessage = document.createElement('div');
      makeMessage.className = "list-group-item";
      makeMessage.innerHTML = `
      <h6>Sender: ${newMessage.sender}</h6>
      <h5>Subject: ${newMessage.subject}<h5>
      <p>${newMessage.timestamp}</p>
      `;
      makeMessage.className = newMessage.read ? 'read': 'unread';
      
      makeMessage.addEventListener('click', function() {
        view_email(newMessage.id)
      });
      document.querySelector("#emails-view").append(makeMessage);
    })
  });
  }

function send_email(event){
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  //data to backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}
