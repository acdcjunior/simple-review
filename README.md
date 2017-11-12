# Simple Review

Simple Code Review App Based on Docker, Vue.js, PouchDB, CouchDB, GitLab, nginx, Trello and Node.js back-end.

# Steps to develop

Run at `/.dev/`:

    docker-compose up --build
    
- Go to gitlab: http://127.0.0.1:8090/ and provide the password

- Create an **`api`**+**`read_user`** token for `@root`
    - Navigate to `Settings -> Access tokens` or go to http://127.0.0.1:8090/profile/personal_access_tokens
    - Something like `-x-AyJ-9ULh1JytxMRs9`
    
- Create users and project
    - Run the following script in chrome console (change the token before executing):

          var rootTOKEN = '6eG3kEs1rRxynkiCDfD1'; // CHANGE ME!!!
          
          function createUser(name, username) {
            console.log(`Creating: ${username}...`);
            $.ajax({
              url: 'http://127.0.0.1:8090/api/v4/users',
              type: 'post',
              data: {email: `${username}@gmail.com`, username, name, reset_password: true},
              headers: {"PRIVATE-TOKEN": rootTOKEN},
              dataType: 'json',
              success: function (d) { console.info('Successfully created '+username+': ', d); }
            });
          }
          createUser("Joe Never Commits", "simplereview__joe");
          createUser("Alice Alice", "simplereview__alice");
          createUser("Bob Bob", "simplereview__bob");
          createUser("Eve Eve", "simplereview__eve");
          createUser("UpPerCaSe MaRy", "simplereview__MaRy");
          createUser("Othe Team Bart", "simplereview__bart");
          createUser("Antonio C Jr", "acdcjunior");
          createUser("Bot GitLab", "simplereview__bot");

          $.ajax({
            url: 'http://127.0.0.1:8090/api/v4/projects/user/3', // creating for Alice, if nothing different
            type: 'post',
            data: {name: 'simple-review-sample-project', import_url: 'https://github.com/acdcjunior/simple-review-sample-project.git', visibility: 'public'},
            headers: {"PRIVATE-TOKEN": rootTOKEN},
            dataType: 'json',
            success: function (d) { console.info(`Successfully created project with ID: ${d.id} -- `, d); }
          });

- You should be able to edit and have most of back-end auto-updated. If not, run `.dev/restart-back.bat`
- For the front-end you'll have to run it locally (`npm i && npm run dev`) and go to http://127.0.0.1:5555