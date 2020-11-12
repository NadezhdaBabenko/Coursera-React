
//npm install grunt@1.0.2 --save-dev
'use strict';
//делаем все тоже самое что при помощи npm scripts в файле package.json устанавливаем npm и потом настраиваем здесь
module.exports = function(grunt) {

    require('time-grunt')(grunt);

    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin' //поэтому вам нужно сообщить "jit-grunt" говоря, что конфигурация "useminPrepare", которую мы представили, будет обрабатывается самим плагином grunt-usemin. Поэтому мне нужно явно указать, в противном случае "jit-grunt" будет искать плагин "useminPrepare" Grunt.
    });

    //npm install --save-dev time-grunt@1.4.0 jit-grunt@0.10.0 так же в терминале устанавливаешь пакеты
    grunt.initConfig({
        //подключаем scss - компилируем =     "scss": "node-sass -o css/ css/",
        //npm install --save-dev grunt-sass@2.1.0 
        sass: { //название задачи
            dist: {
                files: {//какие файлы участвуют
                    'css/styles.css': 'css/styles.scss'
                }
            }
        },
        //смотрит за изменением css =     "watch:scss": "onchange 'css/*.scss' -- npm run scss",
        //npm install grunt-contrib-watch@1.0.0
        watch: {
            files: 'css/*.scss',//какие файлы участвуют
            tasks: ['sass']
        },
        //отображение в браузере без перезагрузки =     "lite": "lite-server",
        //npm install --save-dev grunt-browser-sync@2.2.0
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './'
                    }
                }
            }
        },
        // npm install --save-dev grunt-contrib-copy@1.0.0 grunt-contrib-clean@1.1.0 
        copy: { //копирует все файлы html в папку dist 
            html: {
                files: [{ //какие файлы участвуют
                    expand: true,
                    dot:  true,
                    cwd: './',
                    src: ['*.html'],
                    dest: 'dist'
                }]
            },
            fonts: { // копирует фонтс =     "copyfonts": "copyfiles -f node_modules/font-awesome/fonts/* dist/fonts",
                files: [{//какие файлы участвуют
                    expand: true,
                    dot: true,
                    cwd: 'node_modules/font-awesome',//откуда копирую файлы
                    src: ['fonts/*.*'],//какие файлы я копирую
                    dest: 'dist'//куда копирую
                }]
            }
        },
        clean: { //    "clean": "rimraf dist",
            build: {
                src: ['dist/']// эта папка дист должна быть отчищена
            }
        },
        //npm install --save-dev grunt-contrib-imagemin@2.0.1
        imagemin: { //сжимает картинки =     "imagemin": "imagemin img/* -o dist/img",
            dynamic: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: './',
                    src: ['img/*.{png,jpg,gif}'],
                    dest: 'dist/'

                }]
            }
        },
        //npm install --save-dev grunt-contrib-concat@1.0.1 grunt-contrib-cssmin@2.2.1 grunt-contrib-htmlmin@2.4.0 grunt-contrib-uglify@3.3.0 grunt-filerev@2.3.1 grunt-usemin@3.1.1
        useminPrepare: { //хз что это
            foo1: { //рандомное имя = ,ыла ошибка - для каждой страницы надо отдельно все написать foo1 foo2 foo3
                dest: 'dist',
                src: ['contactus.html']
            },
            foo2: { //рандомное имя
                dest: 'dist',
                src: ['aboutus.html']
            },
            foo3: { //рандомное имя
                dest: 'dist',
                src: ['index.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                            var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0, rebase: false
                                };
                            } 
                        }]
                    }
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {}
        },
        uglify: {
            dist: {}
        },
        cssmin: {
            dist: {}
        },
        filerev: {//ревизия файлов main.js, main.css .. обновляет автоматически, даже если в браузере сохранены предыдущие версии этих файлов убейте меня.....
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css'
                    ]
                }]
            }
        },
        usemin: {
            html: ['dist/contactus.html','dist/aboutus.html','dist/index.html'],
            options: {
                assetsDirs: ['dist', 'dist/css', 'dist/js']
            }
        },
        htmlmin: { //описывается именно после usemin - должен выполняться в итоговых файлах после usemin
            dist: {
                options: {
                    collapseWhitespace: true //при минимизации пробелы будут свернуты (убраны) из html файлов 
                },
                files: {
                    'dist/index.html': 'dist/index.html',  // 'destination': 'source'
                    'dist/contactus.html': 'dist/contactus.html',
                    'dist/aboutus.html': 'dist/aboutus.html',
                }
            }
        }
    });

    grunt.registerTask('css', ['sass']);//задание css ,которое выполняет sass
    grunt.registerTask('default', ['browserSync', 'watch']);// задание ДЭФОЛТ, которое выполняет browserSync и watch
    grunt.registerTask('build', [
        'clean', 
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ])//задание БИЛД, настраивает эти задачи. B терминале вводишь grunt build и выполняются все задачи (в папку dist копируются папки fonts, img and *.html 1-3 задачи)
};
