import app from './app';

const main = async () => {
    try {
        app.listen(app.get('port'));
        console.log(`app --> Server started at port ${app.get('port')}`);
    } catch (error) {
        console.log(`app --> Server failed to start at port ${app.get('port')}`);
    }
};

main();
