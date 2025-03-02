document.addEventListener('DOMContentLoaded', () => {
    // Initialize ShortcutManager
    new ShortcutManager();

    const categorySelect = document.getElementById('categorySelect');
    const newFolder = document.getElementById('newFolder');
    const addBtn = document.getElementById('addBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const headingInput = document.getElementById('headingInput');
    const contentInput = document.getElementById('contentInput');
    const tagsInput = document.getElementById('tagsInput');
    const savePrompt = document.getElementById('savePrompt');
    const searchInput = document.getElementById('searchInput');
    const tagSearchInput = document.getElementById('tagSearchInput');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const promptList = document.getElementById('promptList');
    
    // Track currently edited prompt
    let editingPrompt = null;
  
    // Load saved categories and prompts
    loadSavedCategories();
    loadPrompts();
  
    // Function to load saved categories
    function loadSavedCategories() {
        chrome.storage.sync.get(['categories', 'lastCategory'], (result) => {
            if (result.categories && result.categories.length > 0) {
                // Clear existing options except General
                while (categorySelect.options.length > 1) {
                    categorySelect.remove(1);
                }
                // Add saved categories
                result.categories.forEach(category => {
                    if (category !== 'General') {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = category;
                        categorySelect.appendChild(option);
                    }
                });
                
                // Restore last selected category
                if (result.lastCategory) {
                    categorySelect.value = result.lastCategory;
                }
            }
            // Load prompts after categories are restored
            loadPrompts();
        });
    }
  
    // Add category change listener
    categorySelect.addEventListener('change', () => {
        loadPrompts();
        // Save last selected category
        chrome.storage.sync.set({ lastCategory: categorySelect.value });
    });
  
    // Update Add folder event listener
    addBtn.addEventListener('click', () => {
        if (newFolder.value.trim()) {
            const option = document.createElement('option');
            option.value = newFolder.value.trim();
            option.textContent = newFolder.value.trim();
            categorySelect.appendChild(option);
  
            // Save updated categories and set as last category
            const categories = Array.from(categorySelect.options).map(opt => opt.value);
            chrome.storage.sync.set({ categories, lastCategory: newFolder.value.trim() }, () => {
                categorySelect.value = newFolder.value.trim();
                newFolder.value = '';
                loadPrompts();
            });
        }
    });
  
    // Delete folder
    deleteBtn.addEventListener('click', () => {
      const selectedOption = categorySelect.options[categorySelect.selectedIndex];
      if (selectedOption.value !== 'General') {
        const deletedCategory = selectedOption.value;
        categorySelect.removeChild(selectedOption);
        
        // Update categories in storage
        const categories = Array.from(categorySelect.options).map(opt => opt.value);
        chrome.storage.sync.set({ categories });
        
        // Remove prompts from deleted category
        chrome.storage.sync.get(['prompts'], (result) => {
          const updatedPrompts = result.prompts.filter(prompt => prompt.category !== deletedCategory);
          chrome.storage.sync.set({ prompts: updatedPrompts }, () => {
            // Switch to General category
            categorySelect.value = 'General';
            loadPrompts();
          });
        });
      }
    });
  
    // Save prompt
    // Update the savePrompt event listener
    savePrompt.addEventListener('click', () => {
      const prompt = {
        category: categorySelect.value,
        heading: headingInput.value.trim(),
        content: contentInput.value.trim(),
        tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: editingPrompt ? editingPrompt.timestamp : Date.now()
      };
    
      if (prompt.heading && prompt.content) {
        savePrompt.textContent = 'Saving...';
        savePrompt.disabled = true;
    
        chrome.storage.sync.get(['prompts'], (result) => {
          const prompts = result.prompts || [];
          if (editingPrompt) {
            // Update existing prompt
            const index = prompts.findIndex(p => p.timestamp === editingPrompt.timestamp);
            if (index !== -1) {
              prompts[index] = prompt;
            }
          } else {
            // Add new prompt
            prompts.push(prompt);
          }
          chrome.storage.sync.set({ prompts }, () => {
            savePrompt.textContent = 'Saved!';
            setTimeout(() => {
              savePrompt.textContent = 'Save Prompt';
              savePrompt.disabled = false;
            }, 1000);
            editingPrompt = null;
            loadPrompts();
            clearForm();
          });
        });
      } else {
        // Visual feedback for validation
        if (!prompt.heading) headingInput.style.borderColor = '#da3633';
        if (!prompt.content) contentInput.style.borderColor = '#da3633';
        
        setTimeout(() => {
          headingInput.style.borderColor = '';
          contentInput.style.borderColor = '';
        }, 2000);
      }
    });
  
    // Update the displayPrompts function
    function displayPrompts(prompts) {
      promptList.innerHTML = '';
      if (prompts.length === 0) {
        promptList.innerHTML = `
          <div style="text-align: center; color: #8b949e; padding: 20px;">
            No prompts found. Create your first prompt above!
          </div>
        `;
        return;
      }
    
      prompts.forEach(prompt => {
        function createPromptElement(prompt) {
          const promptElement = document.createElement('div');
          promptElement.className = 'prompt-item';
          const truncatedHeading = prompt.heading.length > 50 ? prompt.heading.substring(0, 50) + '...' : prompt.heading;
          promptElement.innerHTML = `
            <div class="prompt-content-wrapper">
              <div class="prompt-header">
                <h3 title="${prompt.heading}">${truncatedHeading}</h3>
                <small class="prompt-date">${new Date(prompt.timestamp).toLocaleString()}</small>
              </div>
              <div class="prompt-content">${prompt.content}</div>
              <div class="prompt-tags">${prompt.tags ? prompt.tags.join(', ') : ''}</div>
            </div>
            <div class="prompt-actions">
              <button class="action-btn preview-btn" title="Preview">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn copy-btn" title="Copy">
                <i class="fas fa-copy"></i>
              </button>
              <button class="action-btn edit-btn" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn share-btn" title="Share">
                <i class="fas fa-share-alt"></i>
              </button>
              <button class="action-btn delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

          // Add event listeners for the action buttons
          const copyBtn = promptElement.querySelector('.copy-btn');
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(prompt.content);
            showToast('Copied to clipboard!');
          });
      // Add this with your other event listeners
      const searchSection = document.querySelector('.search-section');
      const searchHeader = searchSection.querySelector('h2');
    
      // Load the saved state of the search section
      chrome.storage.sync.get(['searchSectionCollapsed'], (result) => {
          if (result.searchSectionCollapsed) {
              searchSection.classList.remove('expanded');
              searchSection.classList.add('collapsed');
          } else {
              searchSection.classList.remove('collapsed');
              searchSection.classList.add('expanded');
          }
      });
    // Add hover functionality
    searchSection.addEventListener('mouseenter', () => {
        searchSection.classList.remove('collapsed');
        searchSection.classList.add('expanded');
        chrome.storage.sync.set({ searchSectionCollapsed: false });
    });
    
    searchSection.addEventListener('mouseleave', () => {
        searchSection.classList.remove('expanded');
        searchSection.classList.add('collapsed');
        chrome.storage.sync.set({ searchSectionCollapsed: true });
    });
    // Remove the click event listener since we're using hover now
      searchHeader.addEventListener('click', () => {
          searchSection.classList.toggle('collapsed');
          searchSection.classList.toggle('expanded');
          
          // Save the state
          chrome.storage.sync.set({
              searchSectionCollapsed: searchSection.classList.contains('collapsed')
          });
      });
      const editBtn = promptElement.querySelector('.edit-btn');
          editBtn.addEventListener('click', () => {
            editingPrompt = prompt;
            headingInput.value = prompt.heading;
            contentInput.value = prompt.content;
            tagsInput.value = prompt.tags.join(', ');
            categorySelect.value = prompt.category;
            contentInput.scrollIntoView({ behavior: 'smooth' });
            savePrompt.textContent = 'Update Prompt';
          });
      
          const deleteBtn = promptElement.querySelector('.delete-btn');
          deleteBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
              <div class="modal-content">
                <h3>Delete Prompt</h3>
                <p>Are you sure you want to delete this prompt?</p>
                <div class="modal-actions">
                  <button class="cancel-delete">Cancel</button>
                  <button class="confirm-delete">Delete</button>
                </div>
              </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.cancel-delete').addEventListener('click', () => {
              modal.remove();
            });

            modal.querySelector('.confirm-delete').addEventListener('click', () => {
              chrome.storage.sync.get(['prompts'], (result) => {
                const updatedPrompts = result.prompts.filter(p => 
                  p.heading !== prompt.heading || p.timestamp !== prompt.timestamp
                );
                chrome.storage.sync.set({ prompts: updatedPrompts }, () => {
                  loadPrompts();
                  modal.remove();
                });
              });
            });
          });
      
          const previewBtn = promptElement.querySelector('.preview-btn');
          previewBtn.addEventListener('click', () => {
            showPreviewModal(prompt);
          });

          return promptElement;
        }

        const promptElement = createPromptElement(prompt);
        promptList.appendChild(promptElement);
      });
    }
  
    // Add these helper functions
    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
    
    function showPreviewModal(prompt) {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h3>${prompt.heading}</h3>
          <p>${prompt.content}</p>
          <button class="close-modal">Close</button>
        </div>
      `;
      
      modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.body.appendChild(modal);
    }
  
    // Search functionality
    searchInput.addEventListener('input', loadPrompts);
    tagSearchInput.addEventListener('input', loadPrompts);
  
    // Export functionality
    function exportPrompts() {
      chrome.storage.sync.get(['prompts'], (result) => {
        const prompts = result.prompts || [];
        const selectedCategory = categorySelect.value;
        const filteredPrompts = prompts.filter(p => selectedCategory === 'General' ? true : p.category === selectedCategory);
        
        // Convert to CSV
        const csvRows = ['Title,Content,Tags,Category,Date'];
        filteredPrompts.forEach(prompt => {
          const date = new Date(prompt.timestamp).toLocaleString();
          const row = [
            prompt.heading.replace(/"/g, '""'),
            prompt.content.replace(/"/g, '""'),
            prompt.tags.join('; ').replace(/"/g, '""'),
            prompt.category,
            date
          ].map(field => `"${field}"`).join(',');
          csvRows.push(row);
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `ai_prompts_export_${selectedCategory}.csv`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        
        showToast('Prompts exported successfully!');
      });
    }
  
    // Import functionality
    function importPrompts() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const csvContent = e.target.result;
            const rows = csvContent.split('\n').map(row => {
              const matches = row.match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]+))/g) || [];
              return matches.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
            });
            
            if (rows.length < 2) throw new Error('Invalid format');
            
            const importedPrompts = rows.slice(1).map(row => ({
              heading: row[0] || '',
              content: row[1] || '',
              tags: (row[2] || '').split(';').map(tag => tag.trim()).filter(Boolean),
              category: categorySelect.value === 'General' ? 'General' : row[3] || categorySelect.value,
              timestamp: Date.now()
            })).filter(p => p.heading && p.content);
            
            chrome.storage.sync.get(['prompts'], (result) => {
              const existingPrompts = result.prompts || [];
              const mergedPrompts = [...existingPrompts];
              
              importedPrompts.forEach(newPrompt => {
                const exists = existingPrompts.some(existing => 
                  existing.heading === newPrompt.heading && 
                  existing.content === newPrompt.content
                );
                
                if (!exists) {
                  mergedPrompts.push(newPrompt);
                }
              });
              
              chrome.storage.sync.set({ prompts: mergedPrompts }, () => {
                loadPrompts();
                showToast(`Imported ${importedPrompts.length} prompts successfully!`);
              });
            });
          } catch (error) {
            showToast('Error: Invalid CSV format');
          }
        };
        reader.readAsText(file);
      };
      fileInput.click();
    }

    // Add event listeners for export and import buttons
    document.getElementById('exportBtn').addEventListener('click', exportPrompts);
    document.getElementById('importBtn').addEventListener('click', importPrompts);

    function loadPrompts() {
      chrome.storage.sync.get(['prompts'], (result) => {
        const prompts = result.prompts || [];
        const searchTerm = searchInput.value.toLowerCase();
        const tagSearch = tagSearchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
  
        const filteredPrompts = prompts.filter(prompt => {
          const matchesSearch = prompt.heading.toLowerCase().includes(searchTerm) ||
                              prompt.content.toLowerCase().includes(searchTerm);
          const matchesTags = tagSearch === '' ||
                             prompt.tags.some(tag => tag.toLowerCase().includes(tagSearch));
          // Make each folder private - only show prompts saved in that specific folder
          const matchesCategory = prompt.category === selectedCategory;
          
          return matchesSearch && matchesTags && matchesCategory;
        });
  
        displayPrompts(filteredPrompts);
      });
    }
  
    // Update delete folder to also remove from storage
    deleteBtn.addEventListener('click', () => {
      const selectedOption = categorySelect.options[categorySelect.selectedIndex];
      if (selectedOption.value !== 'General') {
        categorySelect.removeChild(selectedOption);
        
        // Update categories in storage
        const categories = Array.from(categorySelect.options).map(opt => opt.value);
        chrome.storage.sync.set({ categories });
        
        // Switch to General category
        categorySelect.value = 'General';
        loadPrompts();
      }
    });
  
    function clearForm() {
      headingInput.value = '';
      contentInput.value = '';
      tagsInput.value = '';
    }
  });