# BitBackup 
BitBackup, is a robust and user-friendly open-source backup tool, designed to help users efficiently and securely backup their important files and folders, ensuring data integrity and accessibility.

# Core Functionality
At its heart, BitBackup ensures that the contents of a specified Source Directory are mirrored to a designated Backup Directory. It performs a two-way backup:

- **Copy/Update:** It identifies new files in the Source Directory and copies them to the Backup Directory. For existing files, it checks if the source file has been modified (based on modification time and content comparison) and updates the backup version if necessary.

- **Remove Outdated:** It removes files and empty directories from the Backup Directory that no longer exist in the Source Directory, ensuring your backup accurately reflects the current state of your source.

# Profile Management
At the top of the application window, you'll find the Profile Name section, which is central to organizing your backup tasks.

![Screenshot 2025-07-01 093904](https://github.com/user-attachments/assets/ecee59c4-d40b-4b8f-b755-4a4e76b0a154)


Key Features
Profile Management:

Profile Selection Dropdown: This dropdown allows you to switch between your saved backup profiles.

- **Create Profile Button (➕):** Users can create multiple distinct backup profiles, each with its own source and backup directory settings.

- **Rename Profile Button (✏️):** Update the name of an existing profile.

- **Delete Profile Button (🗑️):** Remove profiles and their associated data files, offering a clean way to manage configurations.

# Backup Operations

- **BACKUP Button:** This is the primary button to initiate a manual backup for the currently selected profile. When clicked, the application will begin copying and updating files from your source directory to your backup directory.

- **PAUSE/RESUME** Button: During an active backup, this button toggles between pausing and resuming the ongoing process, giving you control over when the backup runs.

- **STOP Button:** If you need to halt a backup immediately, the Stop button will terminate the current operation.

**Automatic Backup**
BitBackup offers convenience through its automatic backup feature.

# Preferences
To customize your experience, BitBackup includes a dedicated preferences section.

**Preferences Button (⚙️):** Clicking this gear icon opens a separate dialog window where you can adjust various application settings, including:


![Gear](https://github.com/user-attachments/assets/d9f4af74-5317-45f8-91a5-fd6ae800da99)

![Screenshot 2025-07-01 094038](https://github.com/user-attachments/assets/5593fcd4-852b-4d5e-8be6-0a5ca5666c28)

**Theme:** Switch between "System," "Light," or "Dark" appearance modes.

**Accent Color:** Choose a primary accent color for the application's UI elements.

**Font:** Select your preferred font from a list of available options.


# How It Works (Technical Overview)
BitBackup leverages several Python modules to achieve its functionality:

`filecmp`: Used for efficient comparison of files to determine if they need to be updated in the backup.

`threading`: Enables background execution of synchronization tasks, preventing the UI from freezing.

`tkinter` and `customtkinter`: Provide the graphical user interface framework, allowing for a modern and customizable desktop application.

`json`: Used for serializing and deserializing application data (profiles, logs, preferences) to and from disk.

`datetime` and `time`: For timestamping logs and managing auto-backup intervals.

BitBackup is a comprehensive solution for local file backup, offering a blend of automation, control, and user-friendly design.
