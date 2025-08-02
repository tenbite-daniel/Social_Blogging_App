const whitelist = ["https://www.frontend.com", "http://localhost:5173"];

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
