import { sanitize } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  /**
   * URL изображения, загруженного пользователем при посте.
   * Используется только в режиме поста.
   * @type {string}
   */
  let imageUrl = "";

  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
          </div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" rows="4" id="description"></textarea>
          </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;
    appEl.innerHTML = appHtml;

    /**
     * Устанавливает сообщение об ошибке в форме.
     * @param {string} message - Текст сообщения об ошибке.
     */
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: sanitize(document.getElementById("description").value),
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
