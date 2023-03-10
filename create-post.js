import { fetchData } from "./function.js"
import { API_URL } from "./config.js"

async function init() {
    const createPostForm = document.querySelector('#create-post-form')
    const userSelectElement = createPostForm.user
    const submitButton = createPostForm.submit

    const users = await fetchData(`${API_URL}/users`)
    console.log(users)

    users.map(user => {
        console.log(user.name)
        console.log(user.id)

        const userOptionElement = document.createElement('option')
        userOptionElement.textContent = user.name
        userOptionElement.value = user.id

        userSelectElement.append(userOptionElement)
    })

    submitButton.removeAttribute('disabled')

    createPostForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const title = event.target.title.value
        const body = event.target.body.value
        const userId = Number(event.target.user.value)
        

        const createdUserData = {
            // title: title,
            // boyd: body,
            // userId: user
            // galima ir tiap rasyti kad nereiketu po du kartus
            title,
            body,
            userId
        }

        const newPost = await fetchData(`${API_URL}/posts?_expand=user`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(createdUserData),
        })
        const newPostElement = await createNewPostElement(newPost);

        const previousPostItem = document.querySelector('.post-item')
        if (previousPostItem) {
            previousPostItem.remove()
        }

        createPostForm.after(newPostElement)

        event.target.reset()

    })

}
async function createNewPostElement(postData) {
    let { body, title, id, userId } = postData
    const user = await fetchData(`${API_URL}/users/${userId}`)

    const postItem = document.createElement('div')
    postItem.classList.add('post-item')

    postItem.innerHTML = `<h2 class="post-title"> ${title} (id: ${id})</h2>
    <span class="post-author">Author: ${user.name}</span>
    <p class="post-body">${body}</p>        `

    return postItem
}

init()