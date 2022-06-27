const API_URL = "http://localhost:8080"




const dropMenu = () => {
    var slideMenu = document.getElementById('slide-menu')

    if (slideMenu.classList.contains('slider-on')) {
        slideMenu.classList.replace('slider-on', 'slider-off')
    }
    else {
        slideMenu.classList.replace('slider-off', 'slider-on')
    }
}

const slideLanguage = () => {
    var languageList = document.getElementById('language-list')
    if (languageList.classList.contains('language-list-on')) {
        languageList.classList.replace('language-list-on', 'language-list-off')
    }
    else {
        languageList.classList.replace('language-list-off', 'language-list-on')
    }

}


const language = (lang) => {
    fetch("../static/files/language.json")
        .then(response => response.json())
        .then(jsondata => {
            jsondata.infoCards.forEach(block => {
                document.getElementById(Object.keys(block)[0]).innerText = block[Object.keys(block)[0]][lang]
            })

            jsondata.steps.forEach(block => {
                document.getElementById(Object.keys(block)[0]).innerText = block[Object.keys(block)[0]][lang]

            })

            if (document.querySelectorAll('[translate-id="dw_button"]').length > 0) {
                document.querySelectorAll('[translate-id="dw_button"]')[0].innerText = jsondata.dw_button[lang]
            }


            document.querySelectorAll('[translate-id="lang_button"]')[0].innerText = jsondata.lang_button[lang]

        });
}


const setType = (id) => {
    document.getElementById('select-button').innerText = id
}

const createTypeButtons = () => {
    const types = ['MP3','MP4','WEBM', 'M4A', 'AVI','3GP']

    const buttons = []


    types.forEach((type) => {
        buttons.push(`
        <div class="slider-button ${type}-logo"  onclick="setType(this.id)" id="${type}">
            <img src="./static/images/${type}_youtube.png" class="button-logo"/>            
        </div>
        `)
    })

    document.getElementById('slide-menu').innerHTML = buttons.join('\n')
}

const download = (value) => {

    var loader = `
    <div class="loader"></div>
    `
    var dwButtonContainer = document.getElementById('dw-button-container')
    var title = document.getElementById(value).getAttribute('dt-title')
    dwButtonContainer.innerHTML = loader

    var type = document.getElementById('select-button').innerText
    fetch(`${API_URL}/create-content?url=${value}&type=${type}&videoName=${title}`)
        .then(res => res.json())
        .then(res => {

            if (!res.error) {
                dwButtonContainer.innerHTML = `
        <button onclick="download(this.id)" id="${value}" dt-title="${title}">
            Download
        </button>
        `
                window.open(`${API_URL}/download?path=${res.data}`, '_blank')



            }
        })
        .catch(err => console.log(err))




}

const getVideoData = (value) => {

    var loader = `
    <div class="loader"></div>
    `

    document.getElementById('dw-section').innerHTML = loader
    var language = document.getElementById('language').value


    fetch(`https://noembed.com/embed?url=${value}`)
        .then(res => res.text())
        .then(res => {
            var parsedResponse = JSON.parse(res)
            
            var authorArr = parsedResponse.author_url.split('/')
            var author = authorArr[authorArr.length - 1]
            var videoInfoElement = `
            <div class="download-container">
            <div class="video-info-container">
                <div class="thumbnail">
                    <img src="${parsedResponse.thumbnail_url}" class="thumb-image"/>
                </div>
                <div class="video-info">
                    <span class="info-text info-header">
                        ${parsedResponse.title}
                    </span>
                    
                    <span class="info-text info-youtuber">
                        ${author}
                    </span>
                    
                    
                </div>
            </div>
            <div class="download-button-container" id="dw-button-container">
               <button onclick="download(this.id)" id="${value}" dt-title="${parsedResponse.title}" translate-id="dw_button">
                   ${language == 'tr' ? 'İndir' : 'Download'}
               </button>
        
            </div>
        </div>
            `

            document.getElementById('dw-section').innerHTML = videoInfoElement

        })
        .catch(err => {
            document.getElementById('dw-section').innerHTML = '<span>Video Not Found</span>'
            console.log(err)
        })


}


window.onload = function (e) {
    createTypeButtons()

    document.getElementById('url').addEventListener('change', (e) => {

        if (e.target.value.length !== 0) {
            getVideoData(e.target.value)
        }




    })


    fetch("../static/files/language.json")
        .then(response => response.json())
        .then(jsondata => {
            jsondata.infoCards.forEach(block => {
                document.getElementById(Object.keys(block)[0]).innerText = block[Object.keys(block)[0]]["tr"]

            })

            jsondata.steps.forEach(block => {
                document.getElementById(Object.keys(block)[0]).innerText = block[Object.keys(block)[0]]["tr"]

            })

            if (document.querySelectorAll('[translate-id="dw_button"]').length > 0) {
                document.querySelectorAll('[translate-id="dw_button"]')[0].innerText = jsondata.dw_button["tr"]
            }


            document.querySelectorAll('[translate-id="lang_button"]')[0].innerText = jsondata.lang_button["tr"]

        });
}

