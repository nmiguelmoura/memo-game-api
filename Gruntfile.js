module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                banner: '/*Created by Nuno Machado*/\n'
            },
            build: {
                files: {
                    'www/static/src/dist/memo.min.js':[
                        'www/static/src/nmm/uiPIXI/TexturedBtn.js',
                        'www/static/src/nmm/app/ViewProto.js',
                        'www/static/src/nmm/app/audioSprite.js',
                        'www/static/src/nmm/app/Pool.js',
                        'www/static/src/nmm/app/ScoreView.js',
                        'www/static/src/nmm/app/Card.js',
                        'www/static/src/nmm/app/GameView.js',
                        'www/static/src/nmm/app/GameListElement.js',
                        'www/static/src/nmm/app/GameSelectionView.js',
                        'www/static/src/nmm/app/DifficultyView.js',
                        'www/static/src/nmm/app/MenuView.js',
                        'www/static/src/nmm/app/NameInputView.js',
                        'www/static/src/nmm/app/LogoView.js',
                        'www/static/src/nmm/app/Bg.js',
                        'www/static/src/nmm/app/ViewManager.js',
                        'www/static/src/nmm/app/Logic.js',
                        'www/static/src/nmm/app/Model.js',
                        'www/static/src/nmm/app/SceneController.js',
                        'www/static/src/nmm/engine/AudioManager.js',
                        'www/static/src/nmm/engine/AssetsLoader.js',
                        'www/static/src/nmm/tools/Preloader.js',
                        'www/static/src/nmm/tools/Resize.js',
                        'www/static/src/nmm/utils/utils.js',
                        'www/static/src/nmm/engine/Main.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};