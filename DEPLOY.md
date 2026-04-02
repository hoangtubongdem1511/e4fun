# Deploy E4Fun lên Azure (GitHub Actions)

Dự án gồm **backend** (Express, App Service) và **frontend** (React build, Static Web Apps).

## 1. Tạo App Service cho API

1. [Azure Portal](https://portal.azure.com) → **Create a resource** → **Web App**.
2. **Runtime stack:** Node **20 LTS**, **OS:** Linux.
3. **Pricing:** Free F1 hoặc B1 (Azure for Students).
4. Sau khi tạo → **Configuration** → **Application settings** → thêm:
   - `GOOGLE_API_KEY` **hoặc** `GEMINI_API_KEY` = API key Gemini (giá trị thật; hai tên đều được code đọc).
   - `NODE_ENV` = `production`.
5. **Configuration** → **General settings** → **Startup Command:** `npm start`.
6. **Overview** → **Get publish profile** → tải file `.PublishSettings`.

## 2. GitHub — biến và secret cho backend

Trong repo GitHub: **Settings** → **Secrets and variables** → **Actions**.

**Variables** (tab Variables):

| Name | Ví dụ | Ý nghĩa |
|------|--------|---------|
| `AZURE_WEBAPP_API_NAME` | `e4fun-api` | Tên Web App (subdomain `.azurewebsites.net`) |

**Secrets** (tab Secrets):

| Name | Nội dung |
|------|----------|
| `AZURE_WEBAPP_API_PUBLISH_PROFILE` | Toàn bộ XML trong file publish profile (copy raw) |

## 3. Deploy backend lần đầu

- Push lên `main` có thay đổi trong `backend/`, hoặc chạy workflow **Deploy backend to Azure** thủ công (**Actions** → workflow → **Run workflow**).
- Kiểm tra: mở `https://<AZURE_WEBAPP_API_NAME>.azurewebsites.net/api/health` — phải thấy JSON `{"ok":true}`.

Ghi lại URL API dạng `https://<tên-app>.azurewebsites.net` (không có `/` ở cuối).

## 4. Tạo Static Web App cho frontend

1. Portal → **Create** → **Static Web App**.
2. **Deployment details:** GitHub, chọn repo và branch `main` (có thể bỏ qua nếu chỉ dùng Actions trong repo này).
3. **Build presets:** Custom:
   - **App location:** `frontend`
   - **Api location:** để trống
   - **Output location:** `build`
4. Tạo resource → trong SWA → **Manage deployment token** → copy token.

## 5. GitHub — secret cho frontend

Khi tạo Static Web App và kết nối GitHub, Azure thường tự thêm **một** workflow (vd. `azure-static-web-apps-*.yml`) và **một** secret token có tên dạng `AZURE_STATIC_WEB_APPS_API_TOKEN_<TÊN_RESOURCE>`. Trong repo này file đó là `azure-static-web-apps-brave-bay-03271c700.yml` — **chỉ cần workflow đó** cho SWA; không thêm workflow deploy SWA thứ hai để tránh chạy trùng.

**Secrets:**

| Name | Nội dung |
|------|----------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_*` | Do Azure tạo sẵn (vd. `..._BRAVE_BAY_03271C700`); đừng đổi tên nếu workflow đang tham chiếu đúng. |
| `REACT_APP_API_URL` | URL HTTPS **App Service backend** (Express), ví dụ `https://e4fun-api.azurewebsites.net` — **không** dùng URL `*.azurestaticapps.net` |

Workflow ghi `frontend/.env.production` trước khi build để `REACT_APP_API_URL` được nhúng vào bundle. Nếu thiếu, trình duyệt sẽ gọi nhầm `/api/...` lên Static Web App (405/404).

## 6. Deploy frontend

- Push thay đổi trong `frontend/`, hoặc chạy workflow **Azure Static Web Apps CI/CD** thủ công (**Run workflow**).
- Mở URL Static Web App (trong **Overview** của SWA) và thử các tính năng gọi API.

## Ghi chú

- Đổi URL API sau này: cập nhật secret `REACT_APP_API_URL` và chạy lại workflow frontend.
- PR vào `main` có thể tạo **preview environment** trên SWA (cần đủ secret trên repo).
- Chi phí Gemini tính theo Google AI, không nằm trong bill Azure.
