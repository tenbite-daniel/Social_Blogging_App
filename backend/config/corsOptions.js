const whitelist = ["https://social-blogging-app-mauve.vercel.app", "http://localhost:5173", "http://localhost:5174"];

export const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("not allowed by cors"));
        }
    },
    credentials: true,
    optionsSuccesssStatus: 200,
};
