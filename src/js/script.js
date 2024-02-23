$(function () {

    $("#nome").on("input", function () {
        $(".nome").text($(this).val());
    });

    $("#cargo").on("input", function () {
        $(".cargo").text($(this).val());
    });

    $("#setor").on("input", function () {
        $(".setor").text($(this).val());
    });

    $("#telefone").on("keyup", function () {
        $(".telefone").text($(this).val());
    });

    $("#email").on("input", function () {
        $(".email").text($(this).val());
    });

    $(".baixar").on("click", function (e) {
        gerarImagem($(".nome").text());
    });



    
    const buttonRecortar = document.getElementById('button_recortar');

    const ulrUF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/';
    const uf = document.getElementById('setor');
    const cidade = document.getElementById('cargo');
    


    uf.addEventListener('change', async function(){
        const urlCidades = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf.value+'/municipios'
        const request = await fetch(urlCidades);
        const response = await request.json();
        let options = '';
        response.forEach(function(cidades){
            options += '<option>'+cidades.nome+'</option>'
        })
        cidade.innerHTML = options;
    })
    




    window.addEventListener('load', async()=>{
        const request = await fetch(ulrUF);
        const response = await request.json();
       

        const options = document.createElement("optgroup")
        options.setAttribute('label','UFs')
        response.forEach(function(uf){
            options.innerHTML += '<option>' + uf.sigla + '</options>'
        })
        uf.append(options);
    })

    function crop(image)
    {
        return new Cropper(image, {
            dragMode:'move',
            preview:'#img-preview',
            background:false,

        })
    }


    
    // ESSA FUNÇÃO É PARA GERAR A IMAGEM PARA BAIXAR BASICAMENTE
    function gerarImagem(nome) {
        window.devicePixelRatio = 2;
        html2canvas(document.querySelector('.assinatura'),{
            width: 750,
            height: 600,
            backgroundColor: null,
            scale: 3
        }).then(function (canvas) {
            var name = 'assinatura-' + nome.toLowerCase().replace(" ", "-");
            let xhr = new XMLHttpRequest(); 
            xhr.responseType = 'blob'; //aqui ele está criando um objeto binário grande
            xhr.onload = function () {
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = name + '.png';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove()
            

            };
            xhr.open('GET', canvas.toDataURL("image/png", 1.0));
            xhr.send();
        });
    }

    // mostra o preview da imagem selecionada
    function previewImageUpload(fileInput) {
        const input = document.querySelector(fileInput);
        let file = input.files[0];

        if (file.size > 3145728) {
            $(".msg").addClass("on");
            $(".msg .text").text("Escolha uma imagem menor que 3MB");
            return false;
        }
        

        if (!file) return false;
        
        return URL.createObjectURL(file);
        
    }

   
    //onde coloca a imagem no site
    $("#uploadPhoto").on("change", function () {
        const urlImage = previewImageUpload("#uploadPhoto");
        const imgPreview = $(".img-preview");
        const imgAssinatura = $(".img-assinatura");
       
        
        if (!urlImage) return;

        imgPreview.attr("src", urlImage);
        //aonde implantei o cropper     
        setTimeout(()=>{ 
            
            let cropper = crop($(".img-preview")[0]);
            let privewCrop = document.querySelector("#img-assinatura");

            $(".delete").off().click(function()
            {

                imgAssinatura.attr("src", signatureImage);
                $(".delete").addClass("active");
                if(cropper)
                {
                    cropper.destroy();
                }
            })
            buttonRecortar.addEventListener('click', event =>{

                let croppedCanvas = cropper.getCroppedCanvas();
                let croppedImage = croppedCanvas.toDataURL();

                imgAssinatura.attr("src", croppedImage);
                cropper.destroy();
                
            })
            
         


            $(".delete").addClass("active");
            $(".add-foto .text").text("Alterar foto");     
            
        },200)

    });

    $(".delete").click(function(){
        
        const imgPreview = $(".img-preview");
        const imgAssinatura = $(".img-assinatura");
        var baseImage = "./assets/img/profile.png";
        var signatureImage = "./assets/img/icone-vp-assinatura.png";
        
        
        imgPreview.attr("src", baseImage);
        imgAssinatura.attr("src", signatureImage);
        $("#uploadPhoto").val("");
        $(this).removeClass("active");
        $(".add-foto .text").text("Adicionar foto");
    });

    // define as máscaras de formulário
    var SPMaskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
        spOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(SPMaskBehavior.apply({}, arguments), options);
            }
        };

    $('.mask-phone').mask(SPMaskBehavior, spOptions);

});







// const reader = new FileReader;

// reader.onload = function(Event)
// {
//     const previewImage = document.createElement('img');
//     previewImage.Id = 'preview-image';
//     previewImage.src = Event.target.result;
//     h2Avatar.insertAdjacentElement('afterend', previewImage);
// }

// reader.readAsDataURL(avatarImage.files[0]);