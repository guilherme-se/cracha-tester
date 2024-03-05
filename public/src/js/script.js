$(function () {

    $("#nome").on("input", function () {
        let valor = $(this).val();
        if(valor ==="")
        {
            $(".nome").text("Seu Nome");
        }
        else
        {
            
            $(".nome").text($(this).val().toUpperCase());
        }    
    });
    
    $("#cargo").on("input", function () {
        
        $(".cargo").text($(this).val().toUpperCase());

    });
    
    $("#setor").on("input", function () {
        $(".setor").text($(this).val());
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
            viewMode: 1,
            center:true,
            aspectRatio: 3 / 4,
            cropBoxResizable:true,
            preview:'#img-preview',
            background:false,
        })
    }

    let progressWidth = 0; // Inicializa a largura da barra de progresso como 0%



// Evento de mudança para o campo select
$('#setor').on('change', function() {
    progressWidth = $(this).val() === '' ? progressWidth - 33 : progressWidth + 33;
    updateProgressBar(progressWidth);
});

// Função para atualizar a barra de progresso
function updateProgressBar(width) {
    width = Math.max(0, Math.min(100, width)); // Garante que a largura esteja entre 0% e 100%
    $('.progress-bar').css('width', width + '%');
    $('.progress-bar').text(width + '%');
}

  
    
    // ESSA FUNÇÃO É PARA GERAR A IMAGEM PARA BAIXAR BASICAMENTE
    function gerarImagem(nome) {
        let altura = 700;
        let largura = 400;
    
        if (window.innerWidth <= 1366) {
            altura = 800;
            largura = 400;
        }
    
        html2canvas(document.querySelector('.sign-container'), {
            width: largura,
            height: altura,
            backgroundColor: null,
            scale: 5,
            preserveDrawingBuffer: true
        }).then(function (canvas) {
            var name = nome.toLowerCase().replace(" ", "-") + '-cracha';
            let a = document.createElement('a');
            a.href = canvas.toDataURL("image/png",1.0);
            a.download = name + '.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
    
            // Convertendo o canvas em uma imagem base64
            var imageData = canvas.toDataURL("image/png");
    
            // Criando um formulário para enviar a imagem para o servidor
            var form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', '/salvar-imagem');
    
            // Adicionando um campo oculto com a imagem base64
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'imagem');
            input.setAttribute('value', imageData);
            form.appendChild(input);
    
            // Adicionando um campo com o nome do arquivo
            var inputNome = document.createElement('input');
            inputNome.setAttribute('type', 'hidden');
            inputNome.setAttribute('name', 'nome');
            inputNome.setAttribute('value', name);
            form.appendChild(inputNome);
    
            // Adicionando o formulário ao DOM e enviando-o
            document.body.appendChild(form);
            form.submit();
    
            // Removendo o formulário do DOM após o envio
            document.body.removeChild(form);
        });
    }
    
    
    
    // Função auxiliar para converter uma imagem base64 em um objeto Blob
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: mimeString });
        return blob;
    }
    

    
    
    // mostra o preview da imagem selecionada
    function previewImageUpload(fileInput) {
        const input = document.querySelector(fileInput);
        let file = input.files[0];
        
        if (file.size > 113145728) {
            $(".msg").addClass("on");
            $(".msg .text").text("Escolha uma imagem menor que 3MB");
            return false;
        }
        if (!file) return false;
        return URL.createObjectURL(file);
    }
    
    
    let buttonDelete = document.querySelector('.delete');
    let cropper;
    //onde coloca a imagem no site
    $("#uploadPhoto").on("change", function () {
        const urlImage = previewImageUpload("#uploadPhoto");
        const imgPreview = $(".img-preview");
        const imgAssinatura = $(".img-assinatura");
        
        if (!urlImage) return;
        
        imgPreview.attr("src", urlImage);
        //aonde implantei o cropper     
        setTimeout(()=>{ 
            if(cropper)
            {
                cropper.destroy();
            }
            cropper = crop($(".img-preview")[0]);
            let privewCrop = document.querySelector("#img-assinatura");
            
            $(".delete").css("display", "block");
            buttonRecortar.addEventListener('click', event =>{
                
                let croppedCanvas = cropper.getCroppedCanvas(
                    {
                        width:300,
                        height:400,
                    }
                    );
                    cropper.destroy();
                    let croppedImage = croppedCanvas.toDataURL();
                    imgAssinatura.attr("src", croppedImage); 
                    $(".delete").css("display", "none");
                })
                
            },200)

            $(".delete").addClass("active");
            buttonDelete.addEventListener('click', function(){
                buttonDelete.style.display = 'none';
            })
            $(".add-foto .text").text("Alterar foto");  
            
        });

        $(".delete").click(function(){
            
            
            const imgPreview = $(".img-preview");
            const imgAssinatura = $(".img-assinatura");
            var baseImage = "./assets/img/profile.png";
            var signatureImage = "./assets/img/model-profile.png";
            
        
            
            imgPreview.attr("src", baseImage);
            imgAssinatura.attr("src", signatureImage);
            $("#uploadPhoto").val("");
            $(this).removeClass("active");
            $(".add-foto .text").text("Adicionar foto");
            
            if(cropper)
            {
                cropper.destroy();
                cropper = null;
            }
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




//criei aqui uma mask para caracteres do nome da pessoa

let nome = document.getElementById('nome');
let spanAlert = document.createElement('span');

function alertCaracter(nome)
{
    let alert = document.querySelector('.alert');
    let numb_string = nome.value.length;
    if(numb_string == 20)
    {
        nome.style.borderColor ="red";
        spanAlert.style.color ='red';
        spanAlert.style.fontSize = "10px";
        spanAlert.innerHTML = "você chegou no limite de 20 caracteres";
        if(!spanAlert.parentNode)
        {
            alert.insertAdjacentElement("afterend", spanAlert); 
        }
    }else{
        nome.style.borderColor ="gray";
        if(spanAlert.parentNode)
        {
            spanAlert.remove();
        }
    }
}












