// ============================================
// AURA OSINT Desktop - Build Script
// Tauri build configuration
// ============================================

fn main() {
    // Set build-time environment variables
    println!("cargo:rustc-env=BUILD_DATE={}", chrono::Utc::now().format("%Y-%m-%d %H:%M:%S UTC"));
    
    // Get git commit hash if available
    if let Ok(output) = std::process::Command::new("git")
        .args(&["rev-parse", "--short", "HEAD"])
        .output()
    {
        if output.status.success() {
            let git_hash = String::from_utf8_lossy(&output.stdout).trim().to_string();
            println!("cargo:rustc-env=GIT_HASH={}", git_hash);
        } else {
            println!("cargo:rustc-env=GIT_HASH=unknown");
        }
    } else {
        println!("cargo:rustc-env=GIT_HASH=unknown");
    }
    
    // Run Tauri build
    tauri_build::build()
}