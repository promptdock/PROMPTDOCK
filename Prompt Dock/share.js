// Share functionality
function createShareModal(promptContent) {
  const modal = document.createElement('div');
  modal.className = 'share-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'share-modal-content';

  const header = document.createElement('div');
  header.className = 'share-modal-header';

  const title = document.createElement('h3');
  title.textContent = 'Share to';

  const closeButton = document.createElement('button');
  closeButton.className = 'share-modal-close';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => modal.remove();

  header.appendChild(title);
  header.appendChild(closeButton);

  const shareOptions = document.createElement('div');
  shareOptions.className = 'share-options';

  const twitterButton = createShareButton('twitter', 'X', promptContent);
  const redditButton = createShareButton('reddit', 'Reddit', promptContent);

  shareOptions.appendChild(twitterButton);
  shareOptions.appendChild(redditButton);

  modalContent.appendChild(header);
  modalContent.appendChild(shareOptions);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}

function createShareButton(platform, text, promptContent) {
  const button = document.createElement('button');
  button.className = `share-button ${platform}`;
  button.innerHTML = `<i class="fab fa-${platform}"></i> ${text}`;

  button.onclick = () => {
    let url;
    const shareText = encodeURIComponent(promptContent);

    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case 'reddit':
        url = `https://reddit.com/submit?title=${shareText}`;
        break;
    }

    window.open(url, '_blank');
  };

  return button;
}

// Export functions for use in popup.js
window.createShareModal = createShareModal;

// Share functionality for prompts
class ShareManager {
    constructor() {
        this.modalTemplate = `
            <div class="share-modal">
                <div class="share-modal-content">
                    <div class="share-modal-header">
                        <h3>Share Prompt</h3>
                        <button class="share-modal-close">×</button>
                    </div>
                    <div class="share-options">
                        <button class="share-button twitter">
                            <i class="fab fa-twitter"></i>
                            X (Twitter)
                        </button>
                        <button class="share-button reddit">
                            <i class="fab fa-reddit-alien"></i>
                            Reddit
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                const promptItem = e.target.closest('.prompt-item');
                const promptData = {
                    title: promptItem.querySelector('.prompt-header h3').textContent,
                    content: promptItem.querySelector('.prompt-content').textContent,
                    tags: promptItem.querySelector('.prompt-tags').textContent
                };
                this.showShareModal(promptData);
            }

            if (e.target.closest('.share-modal-close')) {
                this.closeShareModal();
            }

            if (e.target.closest('.share-button.twitter')) {
                const modal = document.querySelector('.share-modal');
                const promptData = modal._promptData;
                this.shareToTwitter(promptData);
            }

            if (e.target.closest('.share-button.reddit')) {
                const modal = document.querySelector('.share-modal');
                const promptData = modal._promptData;
                this.shareToReddit(promptData);
            }
        });
    }

    showShareModal(promptData) {
        this.closeShareModal(); // Close any existing modal
        const modalElement = document.createElement('div');
        modalElement.innerHTML = this.modalTemplate;
        document.body.appendChild(modalElement.firstElementChild);

        const modal = document.querySelector('.share-modal');
        modal._promptData = promptData;
    }

    closeShareModal() {
        const modal = document.querySelector('.share-modal');
        if (modal) {
            modal.remove();
        }
    }

    shareToTwitter(promptData) {
        const text = `${promptData.title}\n\n${promptData.content}\n\nTags: ${promptData.tags}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        this.closeShareModal();
    }

    shareToReddit(promptData) {
        const title = promptData.title;
        const text = `${promptData.content}\n\nTags: ${promptData.tags}`;
        const url = `https://reddit.com/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        this.closeShareModal();
    }
}

// Initialize share functionality when the document is loaded
// Add this at the end of the file, before the DOMContentLoaded event listener

function createAboutModal() {
  const modal = document.createElement('div');
  modal.className = 'about-modal';

  const content = document.createElement('div');
  content.className = 'about-modal-content';
  content.innerHTML = `
    <div class="about-modal-header">
      <h3>About Prompt Dock</h3>
      <button class="share-modal-close">×</button>
    </div>
    <div class="about-content">
      <p>Prompt Dock is a powerful Chrome extension designed to streamline your AI workflow by efficiently managing and organizing your prompts. Whether you're a developer, content creator, or AI enthusiast, this tool helps you maintain a well-organized library of prompts for various AI platforms.</p>
      <p>Version: 1.0</p>
      <p>Key Features:</p>
      <ul>
        <li>Intelligent Prompt Management: Save and categorize prompts with custom titles and tags</li>
        <li>Advanced Organization: Create and manage custom folders for better prompt organization</li>
        <li>Smart Search: Quick search through prompts by title, content, or tags</li>
        <li>Data Portability: Import and export your prompts collection in CSV format</li>
        <li>Social Integration: Share your favorite prompts directly to X (Twitter) and Reddit</li>
        <li>User-Friendly Interface: Clean and intuitive design for effortless prompt management</li>
        <li>Secure Storage: All your prompts are safely stored in Chrome's sync storage</li>
      </ul>
      <p>Created with ❤️ for the AI community</p>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  const closeBtn = content.querySelector('.share-modal-close');
  closeBtn.addEventListener('click', () => modal.remove());
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  const shareManager = new ShareManager();
  shareManager.init();

  // Add about button functionality
  const aboutBtn = document.getElementById('aboutBtn');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', createAboutModal);
  }
});