$(document).ready(function () {
  // Inicializar Swiper para a galeria
  var gallerySwiper = new Swiper(".gallerySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });

  // Inicializar Cookie Consent
  window.cookieconsent.initialise({
    palette: {
      popup: {
        background: "#1d1d1d",
        text: "#ffffff",
      },
      button: {
        background: "#e16b3a",
        text: "#ffffff",
      },
    },
    theme: "classic",
    position: "bottom-left",
    content: {
      message: "Este site utiliza cookies para melhorar sua experiência.",
      dismiss: "Entendi",
      link: "Saiba mais",
      href: "#",
      policy: "Política de Cookies",
    },
  });

  // Efeito hover para itens do menu
  $(".nav-link").hover(
    function () {
      $(this).css("transform", "translateY(-2px)");
    },
    function () {
      $(this).css("transform", "translateY(0)");
    }
  );

  // Sistema de avaliação com estrelas
  $(".star").on("click", function () {
    const rating = $(this).data("value");
    $("#ratingValue").val(rating);

    // Atualizar visualização das estrelas
    $(".star").each(function () {
      if ($(this).data("value") <= rating) {
        $(this).html("★").css("color", "#ffc107");
      } else {
        $(this).html("☆").css("color", "#6c757d");
      }
    });
  });

  // Hover nas estrelas
  $(".star")
    .on("mouseenter", function () {
      const hoverRating = $(this).data("value");
      $(".star").each(function () {
        if ($(this).data("value") <= hoverRating) {
          $(this).css("color", "#ffc107");
        } else {
          $(this).css("color", "#6c757d");
        }
      });
    })
    .on("mouseleave", function () {
      const currentRating = $("#ratingValue").val();
      $(".star").each(function () {
        if ($(this).data("value") <= currentRating) {
          $(this).css("color", "#ffc107");
        } else {
          $(this).css("color", "#6c757d");
        }
      });
    });

  // Formulário de avaliação
  $("#reviewForm").on("submit", function (e) {
    e.preventDefault();

    const reviewData = {
      name: $("#reviewerName").val(),
      company: $("#reviewerCompany").val(),
      rating: $("#ratingValue").val(),
      message: $("#reviewMessage").val(),
      date: new Date().toISOString(),
    };

    // Salvar no localStorage (em produção, enviar para o servidor)
    let reviews = JSON.parse(localStorage.getItem("nordestinaReviews") || "[]");
    reviews.push(reviewData);
    localStorage.setItem("nordestinaReviews", JSON.stringify(reviews));

    // Mensagem de sucesso
    alert("Avaliação enviada com sucesso! Obrigado pelo feedback.");

    // Fechar modal e limpar formulário
    $("#reviewModal").modal("hide");
    $("#reviewForm")[0].reset();
    $("#ratingValue").val(0);
    $(".star").html("☆").css("color", "#6c757d");
  });

  // Mostrar balão de boas-vindas após 2 segundos
  setTimeout(function () {
    $("#welcomeBubble").addClass("active");
  }, 2000);

  // Fechar balão de boas-vindas
  $("#closeBubble").on("click", function () {
    $("#welcomeBubble").removeClass("active");
  });

  // Fechar balão automaticamente após 10 segundos
  setTimeout(function () {
    $("#welcomeBubble").removeClass("active");
  }, 10000);

  // Animação de elementos ao scrollar
  $(window).scroll(function () {
    $(".fade-in").each(function () {
      var position = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();

      if (scroll > position - windowHeight + 200) {
        $(this).addClass("active");
      }
    });
  });

  // Formulário de orçamento
  $("#budgetForm").on("submit", function (e) {
    e.preventDefault();

    // Mostrar modal de confirmação do Bootstrap
    var confirmationModal = new bootstrap.Modal(
      document.getElementById("confirmationModal")
    );
    confirmationModal.show();
  });

  // Confirmar envio do formulário
  $("#confirmSend").on("click", function () {
    // Fechar modal
    var confirmationModal = bootstrap.Modal.getInstance(
      document.getElementById("confirmationModal")
    );
    confirmationModal.hide();

    // Mostrar loading
    $("#formLoading").show();
    $("#budgetForm button").prop("disabled", true);

    // Coletar dados do formulário
    const formData = {
      name: $("#name").val(),
      company: $("#company").val(),
      phone: $("#phone").val(),
      email: $("#email").val(),
      people: $("#people").val(),
      message: $("#message").val(),
    };

    // Simular envio (substituir por API real)
    setTimeout(function () {
      // Esconder loading
      $("#formLoading").hide();
      $("#budgetForm button").prop("disabled", false);

      // Mensagem de sucesso
      showFormMessage(
        "Solicitação enviada com sucesso! Entraremos em contato em breve.",
        "success"
      );

      // Preparar mensagem para WhatsApp
      const whatsappMessage = `Olá! Gostaria de solicitar um orçamento:%0A%0A*Nome:* ${formData.name}%0A*Empresa:* ${formData.company}%0A*Telefone:* ${formData.phone}%0A*E-mail:* ${formData.email}%0A*Número de pessoas:* ${formData.people}%0A*Mensagem:* ${formData.message}`;

      // Abrir WhatsApp
      window.open(
        `https://wa.me/5581996482736?text=${whatsappMessage}`,
        "_blank"
      );

      // Limpar formulário
      $("#budgetForm")[0].reset();
    }, 2000);
  });

  // Carregar dicas nutricionais em tempo real com renovação a cada 2 dias
  function loadNutritionTips() {
    const lastLoadDate = localStorage.getItem("nutritionTipsLastLoad");
    const now = new Date().getTime();
    const twoDays = 2 * 24 * 60 * 60 * 1000; // 2 dias em milissegundos

    // Verificar se precisa renovar as dicas
    if (!lastLoadDate || now - lastLoadDate > twoDays) {
      localStorage.setItem("nutritionTipsLastLoad", now);

      // Dicas que serão renovadas a cada 2 dias
      const tips = [
        {
          title: "Benefícios dos Alimentos Regionais",
          content:
            "Nossos pratos utilizam ingredientes regionais frescos, ricos em nutrientes essenciais para uma alimentação balanceada.",
        },
        {
          title: "Hidratação no Trabalho",
          content:
            "Além das refeições, oferecemos sucos naturais para manter sua equipe hidratada e produtiva durante o dia.",
        },
        {
          title: "Variedade de Cardápio",
          content:
            "Nosso cardápio é elaborado por nutricionistas para oferecer variedade e equilíbrio nutricional todas as semanas.",
        },
        {
          title: "Importância das Proteínas",
          content:
            "Nossas refeições são ricas em proteínas para garantir energia e recuperação muscular aos trabalhadores.",
        },
        {
          title: "Carboidratos de Qualidade",
          content:
            "Utilizamos carboidratos complexos que fornecem energia de liberação lenta para o dia todo.",
        },
        {
          title: "Vitaminas e Minerais",
          content:
            "Nossos pratos são preparados com vegetais frescos que fornecem vitaminas e minerais essenciais.",
        },
      ];

      // Embaralhar as dicas para variedade
      const shuffledTips = [...tips]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      localStorage.setItem("nutritionTips", JSON.stringify(shuffledTips));
    }

    // Carregar dicas do localStorage
    const storedTips = JSON.parse(
      localStorage.getItem("nutritionTips") || "[]"
    );

    let tipsHTML = "";
    storedTips.forEach((tip, index) => {
      tipsHTML += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card nutrition-tip-card shadow border-0 h-100">
            <div class="card-body">
              <h4 class="h5">${tip.title}</h4>
              <p class="mb-0">${tip.content}</p>
            </div>
          </div>
        </div>
      `;
    });

    $("#nutrition-tips").html(tipsHTML);
  }

  // Carregar dicas quando a página estiver pronta
  loadNutritionTips();

  // Função para mostrar mensagens no formulário
  function showFormMessage(message, type) {
    // Criar elemento de mensagem se não existir
    if ($("#formMessage").length === 0) {
      $("<div>")
        .attr("id", "formMessage")
        .addClass("alert")
        .insertBefore("#budgetForm");
    }

    const messageDiv = $("#formMessage");
    messageDiv
      .removeClass("alert-success alert-danger")
      .addClass("alert-" + (type === "success" ? "success" : "danger"))
      .text(message)
      .fadeIn();

    // Esconder mensagem após 5 segundos
    setTimeout(function () {
      messageDiv.fadeOut();
    }, 5000);
  }

  // Inicializar animações
  $(window).trigger("scroll");

  // Adicionar classe de scrolled na navbar ao rolar
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });
});
