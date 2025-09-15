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

  // Acessibilidade para setas do Swiper
  $(".swiper-button-next").attr("aria-label", "Próxima imagem");
  $(".swiper-button-prev").attr("aria-label", "Imagem anterior");

  // Funcionalidade do Modal Lightbox da Galeria
  var modal = $("#lightboxModal");
  var modalImg = $("#lightboxImage");
  var captionText = $("#lightboxCaption");

  $(".gallery-image-clickable").on("click", function () {
    modal.css("display", "block");
    modalImg.attr("src", $(this).attr("src"));
    captionText.html($(this).attr("alt"));
  });

  $(".close-lightbox").on("click", function () {
    modal.css("display", "none");
  });

  $(window).on("click", function (event) {
    if ($(event.target).is(modal)) {
      modal.css("display", "none");
    }
  });

  // Inicializar Cookie Consent
  if (window.cookieconsent) {
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
  }

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

  // Função para exibir as avaliações na página principal
  function renderTestimonials(reviews, limit) {
    const container = $("#testimonials-container");
    container.empty();

    const sortedReviews = reviews.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const reviewsToDisplay = limit
      ? sortedReviews.slice(0, limit)
      : sortedReviews;

    if (reviewsToDisplay.length === 0) {
      container.html(
        '<p class="text-center">Ainda não há avaliações. Seja o primeiro a nos avaliar!</p>'
      );
      return;
    }

    reviewsToDisplay.forEach((review) => {
      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      const testimonialCard = `
        <div class="col-md-6 col-lg-4">
          <div class="card testimonial-card h-100 border-0 shadow">
            <div class="card-body">
              <div class="rating mb-3">
                ${stars
                  .split("")
                  .map(
                    (s) =>
                      `<i class="fas fa-star" style="color: ${
                        s === "★" ? "#ffc107" : "#6c757d"
                      };"></i>`
                  )
                  .join("")}
              </div>
              <p class="card-text fst-italic">"${review.message}"</p>
              <div class="d-flex align-items-center mt-3">
                <div class="bg-primary-custom rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                  <span class="text-white fw-bold">${review.name
                    .charAt(0)
                    .toUpperCase()}${
        review.company ? review.company.charAt(0).toUpperCase() : ""
      }</span>
                </div>
                <div>
                  <h5 class="mb-0">${review.name}</h5>
                  ${
                    review.company
                      ? `<small class="text-muted">${review.company}</small>`
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.append(testimonialCard);
    });
  }

  // Carregar avaliações do localStorage
  function loadAndRenderReviews() {
    let reviews = JSON.parse(localStorage.getItem("nordestinaReviews") || "[]");
    renderTestimonials(reviews, 3); // Exibe as 3 avaliações mais recentes na página principal
  }
  loadAndRenderReviews();

  // Formulário de avaliação
  $("#reviewForm").on("submit", function (e) {
    e.preventDefault();

    const reviewData = {
      name: $("#reviewerName").val(),
      company: $("#reviewerCompany").val(),
      rating: Number($("#ratingValue").val()) || 0,
      message: $("#reviewMessage").val(),
      date: new Date().toISOString(),
    };

    let reviews = JSON.parse(localStorage.getItem("nordestinaReviews") || "[]");
    reviews.push(reviewData);
    localStorage.setItem("nordestinaReviews", JSON.stringify(reviews));

    alert("Avaliação enviada com sucesso! Obrigado pelo feedback.");

    $("#reviewModal").modal("hide");
    $("#reviewForm")[0].reset();
    $("#ratingValue").val(0);
    $(".star").html("☆").css("color", "#6c757d");

    loadAndRenderReviews(); // Atualiza a lista de avaliações na página
  });

  // Modal para exibir todas as avaliações
  $("#allReviewsModal").on("show.bs.modal", function () {
    const allReviews = JSON.parse(
      localStorage.getItem("nordestinaReviews") || "[]"
    );
    const sortedReviews = allReviews.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const container = $("#all-reviews-container");
    container.empty();

    if (sortedReviews.length === 0) {
      container.html('<p class="text-center">Ainda não há avaliações.</p>');
      return;
    }

    sortedReviews.forEach((review) => {
      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      const formattedDate = new Date(review.date).toLocaleDateString("pt-BR");
      const reviewCard = `
        <div class="card testimonial-card h-100 border-0 shadow-sm mb-4">
          <div class="card-body">
            <div class="rating mb-2">
              ${stars
                .split("")
                .map(
                  (s) =>
                    `<i class="fas fa-star" style="color: ${
                      s === "★" ? "#ffc107" : "#6c757d"
                    };"></i>`
                )
                .join("")}
            </div>
            <p class="card-text fst-italic mb-2">"${review.message}"</p>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0">${review.name}</h5>
                ${
                  review.company
                    ? `<small class="text-muted">${review.company}</small>`
                    : ""
                }
              </div>
              <small class="text-muted">${formattedDate}</small>
            </div>
          </div>
        </div>
      `;
      container.append(reviewCard);
    });
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

  /*  // Formulário de orçamento
  $("#budgetForm").on("submit", function (e) {
    e.preventDefault();
    // Mostrar modal de confirmação do Bootstrap
    var confirmationModal = new bootstrap.Modal(
      document.getElementById("confirmationModal")
    );
    confirmationModal.show();
  });

  // Adicionar comportamento para o botão de confirmação (se existir)
  $("#confirmSend").on("click", function () {
    var confirmationModal = bootstrap.Modal.getInstance(
      document.getElementById("confirmationModal")
    );
    if (confirmationModal) confirmationModal.hide();

    setTimeout(function () {
      $("#budgetForm")[0].reset();
      showFormMessage(
        "Sua solicitação foi enviada com sucesso! Em breve retornaremos o contato.",
        "success"
      );
    }, 500);
  });

  // Função utilitária para mensagens de formulário
  function showFormMessage(message, type) {
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
    setTimeout(function () {
      messageDiv.fadeOut();
    }, 5000);
  }
*/
  // Adicione este trecho em qualquer lugar do seu arquivo script.js, fora do $(document).ready
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success")) {
    showFormMessage(
      "Solicitação enviada com sucesso! Entraremos em contato em breve.",
      "success"
    );
  }

  // Lista completa de Dicas Nutricionais
  const nutritionTips = [
    {
      title: "O segredo para um bom dia: café da manhã reforçado!",
      content:
        "Uma alimentação rica em carboidratos e proteínas logo pela manhã garante a energia necessária para o resto do dia. Não pule essa refeição!",
    },
    {
      title: "Mantenha-se hidratado, por dentro e por fora.",
      content:
        "A água é fundamental para o transporte de nutrientes, a regulação da temperatura e a manutenção da hidratação da pele. Beba água regularmente.",
    },
    {
      title: "Coma com calma e saboreie o momento.",
      content:
        "Mastigar bem os alimentos não só ajuda na digestão, mas também na sensação de saciedade. Desfrute de cada mordida sem pressa.",
    },
    {
      title: "Inclua mais vegetais coloridos no prato.",
      content:
        "Os vegetais de cores variadas são ricos em vitaminas e antioxidantes, essenciais para fortalecer seu sistema imunológico e manter a saúde em dia.",
    },
    {
      title: "Lanches inteligentes: a chave para a energia constante.",
      content:
        "Opte por lanches saudáveis entre as refeições principais, como frutas, oleaginosas ou iogurte, para evitar a fome excessiva e manter o foco.",
    },
    {
      title: "Menos sal e mais sabor natural.",
      content:
        "Reduzir o consumo de sal ajuda a controlar a pressão arterial. Prefira temperos naturais como ervas, alho e especiarias para dar mais sabor à sua comida.",
    },
    {
      title: "Variedade é o tempero da vida e da dieta.",
      content:
        "Experimente diferentes tipos de grãos, proteínas e vegetais. Uma dieta variada garante que você obtenha todos os nutrientes que seu corpo precisa.",
    },
    {
      title: "Durma bem para comer melhor.",
      content:
        "A privação do sono afeta os hormônios que regulam o apetite, podendo levar a escolhas alimentares ruins. Garanta uma boa noite de sono para ter mais controle.",
    },
    {
      title: "Fibras: o caminho para uma digestão saudável.",
      content:
        "Alimentos ricos em fibras, como grãos integrais, frutas e vegetais, melhoram o trânsito intestinal e ajudam a manter a sensação de saciedade por mais tempo.",
    },
    {
      title: "Não ignore a fome emocional, mas aprenda a lidar com ela.",
      content:
        "Reconheça a diferença entre fome física e emocional. Encontre alternativas saudáveis para lidar com o estresse e a ansiedade que não envolvam comida.",
    },
    {
      title: "Proteínas: construindo e reparando seu corpo.",
      content:
        "Inclua proteínas magras em suas refeições, como frango, peixe, ovos ou leguminosas. Elas são essenciais para a construção muscular e a recuperação.",
    },
    {
      title: "O café da manhã é o combustível do cérebro.",
      content:
        "Iniciar o dia com uma refeição nutritiva melhora a concentração, a memória e o desempenho no trabalho. Não saia de casa sem se alimentar!",
    },
    {
      title: "Leia os rótulos dos alimentos.",
      content:
        "Ficar atento à composição dos alimentos industrializados ajuda a evitar o excesso de açúcares, gorduras e sódio. Escolha produtos mais saudáveis.",
    },
    {
      title: "Coma frutas, a sobremesa da natureza.",
      content:
        "As frutas são ricas em vitaminas, minerais e fibras, além de serem uma opção natural e doce para matar a vontade de comer algo gostoso e saudável.",
    },
    {
      title: "Exercite-se e coma bem para viver melhor.",
      content:
        "A atividade física regular, combinada a uma boa alimentação, é a fórmula perfeita para uma vida mais longa e saudável. Movimente-se!",
    },
    {
      title: "A cor do prato importa.",
      content:
        "Monte um prato bem colorido, com vegetais de diferentes tonalidades. Isso garante que você está consumindo uma variedade de nutrientes essenciais.",
    },
    {
      title: "Evite o consumo de refrigerantes e sucos industrializados.",
      content:
        "Essas bebidas são ricas em açúcar e calorias vazias. Prefira água ou sucos naturais para se manter hidratado e saudável.",
    },
    {
      title: "Ajuste o tamanho das porções.",
      content:
        "Comer porções menores e mais frequentes ao longo do dia pode ajudar a manter o metabolismo ativo e evitar picos de glicose.",
    },
    {
      title: "Lembre-se da importância das gorduras boas.",
      content:
        "Inclua em sua dieta fontes de gorduras saudáveis, como abacate, azeite de oliva e peixes ricos em ômega-3, essenciais para a saúde do cérebro e do coração.",
    },
    {
      title: "Cozinhe em casa mais vezes.",
      content:
        "Preparar suas próprias refeições permite que você controle os ingredientes, a quantidade de sal e gordura, garantindo uma alimentação mais saudável e fresca.",
    },
    {
      title: "Alergias e intolerâncias: fique atento aos sinais.",
      content:
        "Se você sentir desconforto após certas refeições, procure a ajuda de um profissional. Reconhecer e lidar com alergias ou intolerâncias é crucial para a saúde.",
    },
    {
      title: "Priorize o consumo de grãos integrais.",
      content:
        "Arroz, pães e massas integrais são ricos em fibras e nutrientes, proporcionando mais energia e saciedade do que suas versões refinadas.",
    },
    {
      title: "Planeje lanches saudáveis para a semana.",
      content:
        "Ter lanches como frutas e castanhas por perto evita que você recorra a opções menos nutritivas quando a fome apertar.",
    },
    {
      title: "Não faça dieta, mude seu estilo de vida.",
      content:
        "Em vez de dietas restritivas, adote hábitos alimentares saudáveis e sustentáveis. A consistência é a chave para o sucesso a longo prazo.",
    },
    {
      title: "Ouça seu corpo e respeite a fome e a saciedade.",
      content:
        "Aprenda a identificar os sinais de fome e de saciedade do seu corpo. Coma quando estiver com fome e pare quando estiver satisfeito.",
    },
    {
      title: "Aposte em fontes de cálcio.",
      content:
        "Leite, iogurte e queijo são essenciais para a saúde dos ossos, mas vegetais como brócolis e couve também são boas fontes de cálcio.",
    },
    {
      title: "O poder das leguminosas.",
      content:
        "Feijão, lentilha e grão de bico são excelentes fontes de proteína e fibras. São versáteis e podem ser incluídos em várias receitas.",
    },
    {
      title: "Beba chá: uma forma de se aquecer e se hidratar.",
      content:
        "Chás de ervas podem ser uma ótima opção para se manter hidratado e aproveitar os benefícios de plantas como camomila, hortelã e gengibre.",
    },
    {
      title: "Reduza o consumo de alimentos processados.",
      content:
        "Alimentos processados são geralmente ricos em sódio, açúcar e gorduras não saudáveis. Prefira alimentos frescos e naturais sempre que possível.",
    },
    {
      title: "Não se sinta culpado por comer o que gosta.",
      content:
        "A moderação é a chave. Aproveite suas comidas favoritas com equilíbrio, sem exageros, para manter uma relação saudável com a alimentação.",
    },
  ];

  // Função para calcular o dia do ano
  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // Função para carregar uma dica diferente a cada dia
  function loadDailyTips() {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);

    // Seleciona 3 dicas consecutivas
    const tips = [];
    for (let i = 0; i < 3; i++) {
      const index = (dayOfYear + i) % nutritionTips.length;
      tips.push(nutritionTips[index]);
    }

    // Renderizar no container
    const container = $("#nutrition-tips-container");
    container.empty();

    tips.forEach((tip) => {
      const card = `
      <div class="col-md-4">
        <div class="card border-0 shadow nutrition-tip-card h-100">
          <div class="card-body p-4">
            <h3 class="h5 mb-3">${tip.title}</h3>
            <p class="mb-0">${tip.content}</p>
          </div>
        </div>
      </div>
    `;
      container.append(card);
    });
  }

  // Chamar a função para carregar a dica do dia
  loadDailyTips();

  // Inicializar animações (primeiro disparo)
  $(window).trigger("scroll");

  // Adicionar classe de scrolled na navbar ao rolar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Animação de rolagem suave para âncoras
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $(this.hash).offset().top - 70, // Ajuste para a altura da navbar
      },
      800
    );
  });

  // Limpa o formulário ao carregar a página
  $("#budgetForm")[0].reset();
});
