

(function() {
    'use strict';

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

    function initializeExplorePage() {
        const searchInputElement = $('.app-header .search-input');
        if (!searchInputElement) return;

        const cardsToFilter = $$('.app-main .item-card');
        if (cardsToFilter.length === 0) return;

        searchInputElement.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            cardsToFilter.forEach(card => {
                const titleElement = $('.item-title', card);
                if (titleElement) {
                    const title = titleElement.textContent.toLowerCase();
                    card.style.display = title.includes(searchTerm) ? '' : 'none';
                }
            });
        });
    }

    function initializeMyShowsPage() {
        const myShowsViewElement = $('#myShowsView');
        if (!myShowsViewElement) {
            console.log('MyShowsPage: #myShowsView element not found. Aborting initialization.');
            return;
        }
        console.log('MyShowsPage: #myShowsView found.', myShowsViewElement);


        const tabContainer = $('.my-shows-tabs', myShowsViewElement);
        const tabButtons = $$('.tab-button', tabContainer);
        const showsCountSpan = $('.my-shows-sub-header .shows-count', myShowsViewElement);
        const tvContent = $('#my-shows-tv-content', myShowsViewElement);
        const moviesContent = $('#my-shows-movies-content', myShowsViewElement);
        
        console.log('MyShowsPage: TV Content Element:', tvContent);
        console.log('MyShowsPage: Movies Content Element:', moviesContent);

        const allTabContents = [tvContent, moviesContent].filter(el => el);

        if (allTabContents.length < 2 && (tvContent && moviesContent)) {
            console.warn('MyShowsPage: One or both content tabs might be missing from DOM or selection failed.');
        }


        const updateShowsCount = (activeTabContentElement) => {
            if (showsCountSpan && activeTabContentElement) {
                const visibleCards = $$('.my-show-card:not([style*="display: none"])', activeTabContentElement).length;
                showsCountSpan.textContent = `${visibleCards} show${visibleCards !== 1 ? 's' : ''}`;
            } else if (showsCountSpan) {
                showsCountSpan.textContent = '0 shows';
            }
        };

        const activateTab = (selectedTabButton) => {
        const targetContentId = selectedTabButton.dataset.tabTarget;
        const targetContentElement = $(targetContentId, myShowsViewElement);

            console.log(`--- Activating Tab ---`);
            console.log(`Selected Tab Button:`, selectedTabButton);
            console.log(`Target Content ID: ${targetContentId}`);
            console.log(`Target Content Element (found via $):`, targetContentElement);

            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            console.log(`Hiding all tab contents:`, allTabContents);
            allTabContents.forEach(content => {
                console.log(`Hiding:`, content.id);
                content.style.display = 'none';
            });

            selectedTabButton.classList.add('active');
            
            if (targetContentElement) {
                console.log(`Showing target content element:`, targetContentElement.id);
                targetContentElement.style.display = 'block'; 
                console.log(`Current inline style for ${targetContentElement.id}:`, targetContentElement.getAttribute('style'));
                updateShowsCount(targetContentElement);
            } else {
                console.error(`Could not find target content for ID: ${targetContentId}`);
                updateShowsCount(null);
            }
            console.log(`--- Tab Activation End ---`);
        };
        
        if (tabContainer) {
            tabContainer.addEventListener('click', (event) => {
                const clickedTab = event.target.closest('.tab-button');
                if (clickedTab && !clickedTab.classList.contains('active')) {
                    console.log('Tab clicked:', clickedTab);
                    activateTab(clickedTab);
                }
            });
        } else {
            console.error('MyShowsPage: Tab container (.my-shows-tabs) not found.');
        }

        const initiallyActiveTabButton = $('.tab-button.active', tabContainer);
        if (initiallyActiveTabButton) {
            console.log('MyShowsPage: Initializing with active tab:', initiallyActiveTabButton);
            activateTab(initiallyActiveTabButton);
        } else if (tabButtons.length > 0) {
            console.log('MyShowsPage: No active tab found, initializing with first tab:', tabButtons[0]);
            activateTab(tabButtons[0]);
        } else {
            console.warn('MyShowsPage: No tab buttons found.');
            updateShowsCount(null);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initializeExplorePage();
        initializeMyShowsPage();
    });

})();