import { http } from './http.js';
import { ui } from './ui.js';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

ui.post.addEventListener('click', deletePost);

ui.post.addEventListener('click', editPost);

document.querySelector('.card-form').addEventListener('click', cancelEdit);

// Get Posts
function getPosts() {
  http.get('http://localhost:3000/posts')
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}

// Submit Post
function submitPost(e) {
  if (ui.titleInput.value != '' && ui.bodyInput.value != '') {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;

    const data = {
      title,
      body
    }

    if (id == '') {
      // Create Post
      http.post('http://localhost:3000/posts', data)
      .then(data => {
        ui.showAlert('Post added', 'alert alert-success');
        ui.clearFields();
        getPosts();
      })
      .catch(err => console.log(err));
    } else {
      http.put(`http://localhost:3000/posts/${id}`, data)
      .then(data => {
        ui.showAlert('Post updated', 'alert alert-success');
        ui.changeState('add');
        getPosts();
      })
      .catch(err => console.log(err));
    }
  }
}

function deletePost(e) {
  if (e.target.parentElement.classList.contains('delete')) {
    e.preventDefault();
    
    http.delete(`http://localhost:3000/posts/${e.target.parentElement.getAttribute('data-id')}`)
      .then(data => {
        ui.showAlert('post Deleted', 'alert alert-success');
        getPosts();
      })
      .catch(err => console.log(err));
  }
}

function editPost(e) {
  if (e.target.parentElement.classList.contains('edit')) {
    e.preventDefault();
    const post = e.target.parentElement.parentElement;

    const id = e.target.parentElement.dataset.id,
    title = post.firstElementChild.textContent,
    body = post.children[1].textContent,
    data = {
      id,
      title,
      body
    };

    ui.fillForm(data);
  }
}

function cancelEdit(e) {
  e.preventDefault();
  if (e.target.classList.contains('post-cancel')) {
    ui.changeState('add');
  }
}