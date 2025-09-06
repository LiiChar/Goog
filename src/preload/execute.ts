import fs from 'fs';
import path from 'path';
import vdf from 'vdf';

const steamPath = 'C:/Program Files (x86)/Steam/steamapps';

function getInstalledGames() {
  const files = fs.readdirSync(steamPath).filter((f) => f.startsWith('appmanifest'));
  const games = files.map((file) => {
    const content = fs.readFileSync(path.join(steamPath, file), 'utf-8');
    const parsed = vdf.parse(content);
    return {
      appid: parsed.AppState.appid,
      name: parsed.AppState.name,
      installdir: parsed.AppState.installdir,
    };
  });
  return games;
}

console.log(getInstalledGames());
