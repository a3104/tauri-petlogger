use std::io::{ BufRead, Read, Write};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn aaa() {
    println!("aaa");
}

#[tauri::command]
fn load_weights() -> Result<String, String> {
    // ファイルが存在しない場合 "[]" を返す
    let file = match std::fs::File::open("../weights.json") {
        Ok(file) => file,
        Err(_) => return Ok("[]".to_string()),
    };

    let mut reader = std::io::BufReader::new(file);
    let mut buf = String::new();
    reader.read_to_string(&mut buf).map_err(|e| e.to_string())?;
    Ok(buf)
}

#[tauri::command]
fn save_weights(weights_json: String) -> Result<(), String> {
    let file = std::fs::File::create("../weights.json").map_err(|e| e.to_string())?;
    let mut writer = std::io::BufWriter::new(file);
    writer.write_all(weights_json.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_pets() -> Result<String, String> {
    // ファイルが存在しない場合 "[]" を返す
    let file = match std::fs::File::open("../pets.json") {
        Ok(file) => file,
        Err(_) => return Ok("[]".to_string()),
    };

    let mut reader = std::io::BufReader::new(file);
    let mut buf = String::new();
    reader.read_to_string(&mut buf).map_err(|e| e.to_string())?;
    println!("{}", format!("come{}", buf));
    Ok(buf)
}

#[tauri::command]
fn save_pets(pets_json: String) -> Result<(), String> {
    let file = std::fs::File::create("../pets.json").map_err(|e| e.to_string())?;
    let mut writer = std::io::BufWriter::new(file);
    println!("come");
    writer.write_all(pets_json.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, aaa, save_pets, load_pets, save_weights, load_weights])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, _event| {})
}
