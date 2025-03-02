document.addEventListener('DOMContentLoaded', () => {
  const vipBtn = document.getElementById('vipBtn');
  let vipPopup = null;

  const serviceCategories = [
    { 
      icon: '💰', 
      title: 'Sales', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create a compelling sales pitch for {product/service}',
        'Generate follow-up email templates for potential clients',
        'Design a customer objection handling script',
        'Create a value proposition statement for {product}',
        'Write a cold outreach message template',
        'Develop a sales meeting agenda template',
        'Create customer success stories format',
        'Generate sales qualification questions',
        'Write product demonstration script',
        'Create closing techniques and phrases'
      ]
    },
    { 
      icon: '📚', 
      title: 'Education', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create a lesson plan for {subject}',
        'Design a student assessment rubric',
        'Generate engaging discussion questions',
        'Write clear learning objectives',
        'Create student feedback templates',
        'Design interactive activities for {topic}',
        'Generate study guide outline',
        'Create concept explanation examples',
        'Write student progress report template',
        'Design group project guidelines'
      ]
    },
    { 
      icon: '📈', 
      title: 'Marketing', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create a compelling social media campaign for {product}',
        'Write engaging email newsletter content',
        'Generate content marketing strategy outline',
        'Create viral marketing campaign ideas',
        'Design marketing funnel strategy',
        'Write persuasive ad copy variations',
        'Create brand voice guidelines',
        'Generate lead magnet ideas',
        'Design customer avatar template',
        'Create marketing KPI tracking framework'
      ]
    },
    { 
      icon: '👤', 
      title: 'Solopreneurs', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create a personal brand statement',
        'Design daily productivity routine',
        'Generate passive income ideas',
        'Create business scaling strategy',
        'Write elevator pitch template',
        'Design service packages structure',
        'Create client onboarding process',
        'Generate networking conversation starters',
        'Write professional bio variations',
        'Create time management system'
      ]
    },
    { 
      icon: '💼', 
      title: 'Business', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create business plan executive summary',
        'Generate SWOT analysis template',
        'Write company vision and mission statements',
        'Create employee handbook outline',
        'Design project proposal template',
        'Generate business growth strategies',
        'Create customer service guidelines',
        'Write team meeting agenda template',
        'Design performance review framework',
        'Create risk management plan'
      ]
    },
    { 
      icon: '✍️', 
      title: 'Writing', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create blog post outline template',
        'Generate creative story ideas',
        'Write article introduction hooks',
        'Create character development guide',
        'Design content style guide',
        'Generate headline variations',
        'Create book chapter outline',
        'Write product description template',
        'Design writing prompt exercises',
        'Create editing checklist'
      ]
    },
    { 
      icon: '⌛', 
      title: 'Productivity', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create daily planning template',
        'Generate goal setting framework',
        'Write time blocking schedule',
        'Create habit tracking system',
        'Design project prioritization matrix',
        'Generate focus improvement techniques',
        'Create workflow optimization steps',
        'Write meeting efficiency guidelines',
        'Design energy management routine',
        'Create productivity metrics dashboard'
      ]
    },
    { 
      icon: '🔍', 
      title: 'SEO', 
      prompts: 'Prompts', 
      isNew: true,
      topPrompts: [
        'Create keyword research strategy',
        'Generate meta description templates',
        'Write SEO-optimized content outline',
        'Create link building outreach templates',
        'Design content cluster structure',
        'Generate local SEO optimization steps',
        'Create technical SEO audit checklist',
        'Write image optimization guidelines',
        'Design URL structure guidelines',
        'Create SEO reporting template'
      ]
    }
  ];

  const styles = `
    .vip-prompts-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--bg-secondary);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-width: 480px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .service-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      justify-content: center;
      margin-top: 24px;
      padding: 0 8px;
    }

    .service-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 120px;
      justify-content: center;
      width: 100%;
    }

    .service-icon {
      font-size: 28px;
      margin-bottom: 12px;
    }

    .service-title {
      font-size: 14px;
      font-weight: 600;
      margin: 8px 0;
      color: var(--text-primary);
      text-align: left;
      padding-left: 8px;
    }

    .service-prompts {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
      text-align: left;
      padding-left: 8px;
    }

    .vip-prompts-popup h2 {
      font-size: 24px;
      color: var(--text-primary);
      margin-bottom: 16px;
      font-weight: 600;
      text-align: left;
      padding: 0 0 0 16px;
    }

    .service-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      justify-content: center;
      margin-top: 10px;
    }

    .service-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 80px;
      justify-content: center;
    }

    .service-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .service-title {
      font-size: 11px;
      font-weight: 600;
      margin: 2px 0;
      color: var(--text-primary);
      text-align: left;
      padding-left: 8px;
    }

    .service-prompts {
      font-size: 10px;
      color: var(--text-secondary);
    }

    .new-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
    }

    .prompt-list {
      margin-top: 24px;
    }

    .prompt-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }

    .prompt-item:hover {
      border-color: var(--accent-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .prompt-text {
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-primary);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      text-align: left;
    }

    .prompt-text::before {
      display: none;
    }

    .copy-btn {
      background: var(--accent-color);
      color: white;
      border: none;
      border-radius: 3px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
      min-width: 50px;
      text-align: center;
      margin-left: 8px;
      opacity: 0.9;
    }

    .copy-btn:hover {
      background: var(--accent-color-hover);
      transform: translateY(-1px);
    }

    .vip-prompts-popup h2 {
      font-size: 20px;
      color: var(--text-primary);
      margin-bottom: 20px;
      font-weight: 600;
    }

    .back-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding: 8px 0;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      transform: translateX(-4px);
      opacity: 0.8;
    }

    .back-btn:hover {
      color: var(--accent-color);
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  function showPromptList(category) {
    const promptList = document.createElement('div');
    promptList.className = 'prompt-list';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '← Back to Categories';
    backBtn.onclick = () => {
      vipPopup.innerHTML = '';
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = 'position: absolute; right: 10px; top: 10px; background: none; border: none; color: var(--text-primary); font-size: 24px; cursor: pointer;';
      vipPopup.appendChild(closeBtn);
      closeBtn.onclick = () => {
        document.body.removeChild(vipPopup);
        vipPopup = null;
      };

      const title = document.createElement('h2');
      title.textContent = 'Prompt Categories';
      title.style.marginBottom = '20px';
      vipPopup.appendChild(title);

      const serviceGrid = document.createElement('div');
      serviceGrid.className = 'service-grid';
      vipPopup.appendChild(serviceGrid);

      renderServiceCards(serviceGrid);
    };

    const title = document.createElement('h2');
    title.textContent = `${category.title} Prompts`;
    title.style.marginBottom = '20px';

    vipPopup.innerHTML = '';
    vipPopup.appendChild(backBtn);
    vipPopup.appendChild(title);

    category.topPrompts.forEach((prompt, index) => {
      const promptItem = document.createElement('div');
      promptItem.className = 'prompt-item';

      const promptText = document.createElement('div');
      promptText.className = 'prompt-text';
      promptText.setAttribute('data-number', `${index + 1}.`);
      promptText.textContent = prompt;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(prompt).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 2000);
        });
      };

      promptItem.appendChild(promptText);
      promptItem.appendChild(copyBtn);
      promptList.appendChild(promptItem);
    });

    vipPopup.appendChild(promptList);
  }

  function renderServiceCards(serviceGrid) {
    serviceCategories.forEach(service => {
      const serviceCard = document.createElement('div');
      serviceCard.className = 'service-card';

      const icon = document.createElement('div');
      icon.className = 'service-icon';
      icon.textContent = service.icon;

      const title = document.createElement('div');
      title.className = 'service-title';
      title.textContent = service.title;

      const prompts = document.createElement('div');
      prompts.className = 'service-prompts';
      prompts.textContent = service.prompts;

      if (service.isNew) {
        const newBadge = document.createElement('span');
        newBadge.className = 'new-badge';
        newBadge.textContent = 'FREE';
        serviceCard.appendChild(newBadge);
      }

      serviceCard.onclick = () => showPromptList(service);

      serviceCard.appendChild(icon);
      serviceCard.appendChild(title);
      serviceCard.appendChild(prompts);
      serviceGrid.appendChild(serviceCard);
    });
  }

  function createVipPopup() {
    const popup = document.createElement('div');
    popup.className = 'vip-prompts-popup';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = 'position: absolute; right: 10px; top: 10px; background: none; border: none; color: var(--text-primary); font-size: 24px; cursor: pointer;';
    popup.appendChild(closeBtn);

    const title = document.createElement('h2');
    title.textContent = 'Prompt Categories';
    title.style.marginBottom = '20px';
    
    const promoText = document.createElement('div');
    promoText.textContent = 'FREE NOW';
    promoText.style.cssText = 'color: #FFD700; font-size: 11px; font-weight: 600; text-align: center; margin-bottom: 16px; display: inline-block; padding: 2px 8px; border-radius: 10px; background: rgba(255, 215, 0, 0.1); animation: pulse 1.5s infinite;';
    
    const promoStyle = document.createElement('style');
    promoStyle.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(promoStyle);

    popup.appendChild(title);
    popup.appendChild(promoText);

    const serviceGrid = document.createElement('div');
    serviceGrid.className = 'service-grid';
    popup.appendChild(serviceGrid);

    renderServiceCards(serviceGrid);

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(popup);
      vipPopup = null;
    });

    return popup;
  }

  vipBtn.addEventListener('click', () => {
    if (vipPopup) {
      document.body.removeChild(vipPopup);
      vipPopup = null;
    } else {
      vipPopup = createVipPopup();
      document.body.appendChild(vipPopup);
    }
  });
});
