// ============================================
// AURA OSINT Desktop - Tauri Main
// Professional OSINT Platform
// ============================================

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, SystemTray, SystemTrayMenu, SystemTrayEvent};
use tauri::Manager;

mod commands;
mod osint;
mod database;
mod utils;

use commands::*;

fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    // Create system tray
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "Show AURA OSINT"))
        .add_native_item(MenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));
    
    let system_tray = SystemTray::new().with_menu(tray_menu);
    
    // Create application menu
    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(CustomMenuItem::new("new_session", "New Session").accelerator("CmdOrCtrl+N"))
                .add_item(CustomMenuItem::new("export", "Export Data").accelerator("CmdOrCtrl+E"))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("quit", "Quit").accelerator("CmdOrCtrl+Q"))
        ))
        .add_submenu(Submenu::new(
            "OSINT",
            Menu::new()
                .add_item(CustomMenuItem::new("start_tracking", "Start Tracking").accelerator("CmdOrCtrl+T"))
                .add_item(CustomMenuItem::new("stop_tracking", "Stop Tracking").accelerator("CmdOrCtrl+S"))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("analyze", "Analyze Data").accelerator("CmdOrCtrl+A"))
        ))
        .add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(CustomMenuItem::new("dashboard", "Dashboard").accelerator("CmdOrCtrl+1"))
                .add_item(CustomMenuItem::new("analytics", "Analytics").accelerator("CmdOrCtrl+2"))
                .add_item(CustomMenuItem::new("settings", "Settings").accelerator("CmdOrCtrl+,"))
        ))
        .add_submenu(Submenu::new(
            "Help",
            Menu::new()
                .add_item(CustomMenuItem::new("about", "About AURA OSINT"))
                .add_item(CustomMenuItem::new("docs", "Documentation"))
                .add_item(CustomMenuItem::new("support", "Support"))
        ));

    tauri::Builder::default()
        .menu(menu)
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "about" => {
                // Show about dialog
            }
            _ => {}
        })
        .setup(|app| {
            // Initialize database
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = database::init_database().await {
                    eprintln!("Failed to initialize database: {}", e);
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // OSINT Commands
            start_tiktok_tracking,
            stop_tiktok_tracking,
            get_live_data,
            start_youtube_tracking,
            start_twitch_tracking,
            
            // Data Commands
            get_sessions,
            get_session_data,
            export_session,
            
            // Analytics Commands
            analyze_harassment,
            get_analytics,
            
            // System Commands
            get_app_info,
            check_updates
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}