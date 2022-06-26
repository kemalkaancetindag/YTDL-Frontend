const dropMenu = () => {
    var slideMenu = document.getElementById('slide-menu')

    if (slideMenu.classList.contains('slider-on')) {
        slideMenu.classList.replace('slider-on', 'slider-off')
    }
    else {
        slideMenu.classList.replace('slider-off', 'slider-on')
    }
}

const setType = (id) => {
    document.getElementById('select-button').innerText = id
}

const createTypeButtons = () => {
    const types = ['MP4', 'MP3','WEBM','M4A']
    const colors = ['#FF7396', '#F4E06D', '#C499BA', '#2E0249']
    const buttons = []


    types.forEach((type) => {
        buttons.push(`
        <button class="slider-button" style="background-color:${colors[Math.floor(Math.random() * colors.length)]}" onclick="setType(this.id)" id="${type}">
            ${type}
        </button>
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
    fetch(`http://localhost:3000/create-content?url=${value}&type=${type}&videoName=${title}`)
    .then(res => res.json())
    .then(res => {

        if(!res.error){
            dwButtonContainer.innerHTML = `
            <button onclick="download(this.id)" id="${value}" dt-title="${title}">
                Download
            </button>
            `
            window.open(`http://localhost:3000/download?path=${res.data}`, '_blank')

        }
    })
    .catch(err => console.log(err))    
   

   

}

const getVideoData = (value) => {
   
    var loader = `
    <div class="loader"></div>
    `

    document.getElementById('dw-section').innerHTML = loader
   

    fetch(`https://noembed.com/embed?url=${value}`)
        .then(res => res.text())
        .then(res => {
            var parsedResponse = JSON.parse(res)
            console.log(parsedResponse)
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
               <button onclick="download(this.id)" id="${value}" dt-title="${parsedResponse.title}">
                   Download
               </button>
        
            </div>
        </div>
            `

            document.getElementById('dw-section').innerHTML = videoInfoElement

        })
        .catch(err => {
            console.log(err)
        })


}

window.onload = function (e) {
    createTypeButtons()

    document.getElementById('url').addEventListener('change', (e) => {
        console.log(e.target.value)
        getVideoData(e.target.value)


    })
}

