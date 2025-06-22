document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA ---
    const mockProfiles = {
        "AA": { source: "C:/Users/You/Documents/Work/", backup: "D:/Backups/WorkDocs/" },
        "Photo Library": { source: "C:/Users/You/Pictures/2024/", backup: "E:/PhotoArchive/" },
        "Gaming Saves": { source: "C:/Users/You/Saved Games/", backup: "F:/Cloud/Game_Saves/" }
    };

    const mockLogEntries = [
        { type: 'added', file: 'New Bitmap image.bmp' },
        { type: 'added', file: 'New Microsoft Excel Worksheet.xlsx' },
        { type: 'added', file: 'New folder\\New Bitmap image.bmp' },
        { type: 'changed', file: 'reports/quarterly_summary.docx' },
        { type: 'added', file: 'assets/icons/icon_user.png' },
        { type: 'added', file: 'assets/icons/icon_settings.png' },
        { type: 'changed', file: 'index.html' },
        { type: 'removed', file: 'temp/old_draft.txt' },
        { type: 'added', file: 'photos/vacation/IMG_2024_01.jpg' },
        { type: 'added', file: 'photos/vacation/IMG_2024_02.jpg' },
        { type: 'changed', file: 'config.json' },
    ];
    
    // --- UI ELEMENTS ---
    const profileSelect = document.getElementById('profileSelect');
    const autoBackupSelect = document.getElementById('autoBackupSelect');
    const sourcePathEl = document.getElementById('sourcePath');
    const backupPathEl = document.getElementById('backupPath');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('statusText');
    const logTableBody = document.getElementById('logTableBody');
    const preferencesButton = document.getElementById('preferencesButton');
    const preferencesPanel = document.getElementById('preferencesPanel');
    const pathDisplayContainer = document.getElementById('pathDisplayContainer');
    const togglePathsButton = document.getElementById('togglePathsButton');
    
    // --- STATE VARIABLES ---
    let currentProfile = "AA";
    let isSyncing = false;
    let syncInterval;
    
    // --- INITIALIZATION ---
    function init() {
        Object.keys(mockProfiles).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            profileSelect.appendChild(option);
        });

        profileSelect.value = currentProfile;
        updateProfileDetails();
        
        profileSelect.addEventListener('change', handleProfileChange);
        startBtn.addEventListener('click', startBackupSimulation);
        stopBtn.addEventListener('click', stopBackupSimulation);
        document.getElementById('light-theme-btn').addEventListener('click', () => setTheme('light'));
        document.getElementById('dark-theme-btn').addEventListener('click', () => setTheme('dark'));
        document.querySelectorAll('.theme-color-swatch').forEach(swatch => {
            swatch.addEventListener('click', handleAccentChange);
        });
        preferencesButton.addEventListener('click', togglePreferencesPanel);
        togglePathsButton.addEventListener('click', togglePathVisibility);

        setTheme('light');
    }

    // --- EVENT HANDLERS ---
    function handleProfileChange(e) {
        if (isSyncing) {
            e.target.value = currentProfile; 
            return;
        }
        currentProfile = e.target.value;
        updateProfileDetails();
        resetUI();
    }

    function handleAccentChange(e) {
        const color = e.target.dataset.color;
        const hoverColor = e.target.dataset.hover;
        document.documentElement.style.setProperty('--accent-color', color);
        document.documentElement.style.setProperty('--accent-hover-color', hoverColor);
        // Also update the theme button border to the new accent color if it's active
        setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
    }

    function setTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        
        const lightBtn = document.getElementById('light-theme-btn');
        const darkBtn = document.getElementById('dark-theme-btn');
        
        lightBtn.style.borderColor = theme === 'light' ? 'var(--accent-color)' : 'transparent';
        darkBtn.style.borderColor = theme === 'dark' ? 'var(--accent-color)' : 'transparent';
    }

    function togglePreferencesPanel() {
        preferencesPanel.classList.toggle('show');
    }

    function togglePathVisibility() {
        pathDisplayContainer.classList.toggle('paths-hidden');
        togglePathsButton.textContent = pathDisplayContainer.classList.contains('paths-hidden') ? '▼' : '▲';
    }

    // --- UI UPDATE FUNCTIONS ---
    function updateProfileDetails() {
        const profile = mockProfiles[currentProfile];
        sourcePathEl.textContent = profile.source;
        backupPathEl.textContent = profile.backup;
    }

    function resetUI() {
        logTableBody.innerHTML = `
            <tr class="placeholder-row">
                <td colspan="3" class="p-10 text-center">
                    Click "START BACKUP" to see the log in action.
                </td>
            </tr>`;
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
        statusText.textContent = 'Status: STANDBY';
    }
    
    function addLogEntry(entry) {
        const placeholder = logTableBody.querySelector('.placeholder-row');
        if (placeholder) placeholder.remove();

        const row = document.createElement('tr');
        row.className = 'border-t transition-opacity duration-500 opacity-0';
        row.style.borderColor = 'var(--border-color)';

        const changeMap = {
            added: { text: 'Added', color: '#22c55e', symbol: '➕' },
            changed: { text: 'Modified', color: '#3b82f6', symbol: '🔄' },
            removed: { text: 'Removed', color: '#ef4444', symbol: '❌' }
        };
        const changeInfo = changeMap[entry.type];

        row.innerHTML = `
            <td class="p-3 font-mono">${entry.file}</td>
            <td class="p-3 text-center font-semibold" style="color: ${changeInfo.color};">${changeInfo.symbol}</td>
            <td class="p-3 text-right font-mono" style="color: var(--text-dim-color);">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
        `;
        logTableBody.prepend(row);
        setTimeout(() => row.classList.remove('opacity-0'), 50);
    }
    
    // --- SIMULATION LOGIC ---
    function startBackupSimulation() {
        if (isSyncing) return;
        isSyncing = true;
        
        resetUI();
        progressContainer.classList.remove('hidden');
        statusText.textContent = `Status: Starting sync for '${currentProfile}'...`;
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        profileSelect.disabled = true;
        autoBackupSelect.disabled = true;

        let progress = 0;
        let entryIndex = 0;

        syncInterval = setInterval(() => {
            progress += Math.random() * 10 + 5;
            if (progress >= 100) {
                progress = 100;
                stopBackupSimulation(true);
                return;
            }
            progressBar.style.width = `${progress}%`;
            statusText.textContent = `Status: Backing up... (${Math.round(progress)}%)`;

            if (entryIndex < mockLogEntries.length) {
                const randomEntry = mockLogEntries[entryIndex];
                addLogEntry(randomEntry);
                entryIndex++;
            }
        }, 800);
    }

    function stopBackupSimulation(isSuccess = false) {
        clearInterval(syncInterval);
        isSyncing = false;
        
        if (isSuccess) {
            progressBar.style.width = '100%';
            statusText.textContent = 'Status: Synchronization complete!';
        } else {
            statusText.textContent = 'Status: Synchronization stopped by user.';
        }

        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        profileSelect.disabled = false;
        autoBackupSelect.disabled = false;
    }

    init();
});