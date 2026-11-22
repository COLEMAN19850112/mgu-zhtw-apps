# mgu-zhtw-apps

MGU 車機（iDrive 7）App 的繁體中文（台灣用語）來源倉庫。這是給 MGU Store／updater 使用的 GitHub 來源（根目錄 `mgu-repo.json`）：App 由車機端用自己的 SDK 本地建置，倉庫內沒有預編譯 App、SDK 或任何權杖。

## 收錄項目

| App | 版本 | 原作者與授權 | 資料夾 |
|---|---|---|---|
| HUD 抬頭顯示小工具（HUD Widgets） | 0.15.7 | bimmer-lab，MIT（[LICENSE](bimmer-lab/LICENSE)） | `bimmer-lab/hud/` |
| 數位儀表主題（Cluster Themes） | 0.19.8 | bimmer-lab，MIT（[LICENSE](bimmer-lab/LICENSE)） | `bimmer-lab/themes/` |

原作者倉庫：https://github.com/bimmer-lab/apps 。各作者的授權、MPL／OFL 第三方部分與逐檔歸屬見該作者資料夾內的 `LICENSE`、`MPL-2.0.txt`、`NOTICE.md`、`LICENSES.tsv`；繁中層說明見 [NOTICE.zh-TW.md](NOTICE.zh-TW.md)。之後新增的程式會以「作者／系列」開新資料夾，各帶自己的 kit 與授權檔。

## 使用方式

1. 在 MGU Store 的來源設定加入 GitHub 來源 `COLEMAN19850112/mgu-zhtw-apps`（分支 `main`），或使用相應的來源設定工具。
2. 在 Store 的來源頁選擇要安裝的 App，由車機建置並安裝。
3. App 另需要的元件（例如 cluster-render）請依原作者的說明由原作者來源安裝。

## 免責聲明

這是繁中化的非官方版本，與原作者及 BMW 無隸屬關係；原作者線上更新後可能覆蓋繁中。在車機上安裝非 BMW 提供的 App 風險自負，可能影響保固；請勿在行駛中設定。依 MIT 授權「as is」提供，不附任何擔保。
