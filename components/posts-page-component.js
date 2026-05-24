import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, setPosts } from "../index.js";
import { formatDistanceToNow } from "https://esm.run/date-fns";
import { ru } from "https://esm.run/date-fns/locale";
import { dislikePost, getPosts, getUserPosts, postLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api

  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${posts
                    .map((post, index) => {
                      return `<li class="post">
                                <div class="post-header" data-user-id="${post.user.id}">
                                    <img src="${post.user.imageUrl}" class="post-header__user-image">
                                    <p class="post-header__user-name">${post.user.name}</p>
                                </div>
                                <div class="post-image-container">
                                  <img class="post-image" src="${post.imageUrl}">
                                </div>
                                <div class="post-likes">
                                  <button data-post-id="${post.id}" class="like-button">
                                    <img src="${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
                                  </button>
                                  <p class="post-likes-text">
                                    Нравится: <strong>${post.likes.length >= 2 ? `${post.likes.at(-1).name} и еще ${post.likes.length - 1}` : post.likes.length == 1 ? `${post.likes.at(-1).name}` : 0}</strong>
                                  </p>
                                </div>
                                <p class="post-text">
                                  <span class="user-name">${post.user.name}</span>
                                  ${post.description}
                                </p>
                                <p class="post-date">
                                  ${formatDistanceToNow(
                                    new Date(post.createdAt),
                                    {
                                      locale: ru,
                                    },
                                  )} назад
                                </p>
                              </li>
              `;
                    })
                    .join("")}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  for (let likePostEl of document.querySelectorAll(".like-button")) {
    likePostEl.addEventListener("click", () => {
      const postId = likePostEl.dataset.postId;

      const post = posts.find((p) => p.id === postId);
      const request = post.isLiked
        ? dislikePost({ token: getToken(), id: postId })
        : postLike({ token: getToken(), id: postId });

      request
        .then(() => getPosts({ token: getToken() }))
        .then((newPosts) => {
          setPosts(newPosts);

          renderPostsPageComponent({ appEl });
        });
    });
  }
}

export function renderUserPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${`<div class="posts-user-header">
                    <img src="${posts.at(-1).user.imageUrl}" class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${posts.at(-1).user.name}</p>
                </div>`}
                  ${posts
                    .map((post, index) => {
                      return `
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" class="like-button">
                        <img src="${post.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`}">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length >= 2 ? `${post.likes.at(-1).name} и еще ${post.likes.length - 1}` : post.likes.length == 1 ? `${post.likes.at(-1).name}` : 0}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${formatDistanceToNow(new Date(post.createdAt), {
                        locale: ru,
                      })} назад
                    </p>
                  </li>
              `;
                    })
                    .join("")}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let likePostEl of document.querySelectorAll(".like-button")) {
    likePostEl.addEventListener("click", () => {
      const postId = likePostEl.dataset.postId;

      const post = posts.find((p) => p.id === postId);

      const request = post.isLiked
        ? dislikePost({ token: getToken(), id: postId })
        : postLike({ token: getToken(), id: postId });

      request
        .then(() =>
          getUserPosts({
            token: getToken(),
            id: post.user.id,
          }),
        )
        .then((newPosts) => {
          setPosts(newPosts);

          renderUserPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
}
