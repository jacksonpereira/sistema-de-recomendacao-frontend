angular.module('app', [])
    .controller('RecomendationController', function ($scope, $http, $window) {
        $scope.listaCompleta = [];
        $scope.listaSimples = [];
        $scope.verLista = true;
        $scope.verDesejos = false;
        $scope.verRecomendacoes = false;
        $scope.verAvaliacao = true;

        $scope.buscarJogos = () => {
            $scope.verLista = true;
            $scope.verDesejos = false;
            $scope.verRecomendacoes = false;
            $http.get(`http://localhost:5000/search/${$scope.name}`)
                .then(function (response) {
                    $scope.lista = response.data;
                })
                .catch(function () {
                    $window.alert("Ocorreu um erro ao buscar os jogos.\nTente novamente mais tarde.");
                });
        };

        $scope.verListaDesejos = () => {
            $scope.verLista = false;
            $scope.verDesejos = true;
            $scope.verRecomendacoes = false;
        };

        $scope.adicionarALista = (jogo) => {
            $scope.listaCompleta.push(jogo);
        };

        $scope.limparLista = () => {
            $scope.listaCompleta = [];
            $scope.lista = [];
        }

        $scope.recomendarJogos = () => {
            $scope.verLista = false;
            $scope.verDesejos = false;
            $scope.verRecomendacoes = true;

            for (jogo of $scope.listaCompleta) {
                $scope.listaSimples.push([jogo.plataforma, jogo.genero]);
            }
            $http.post(`http://localhost:5000/recomendation`, $scope.listaSimples)
                .then(function (response) {
                    $scope.recomendacao = [];
                    $scope.recomendacao = response.data;
                })
                .catch(function () {
                    $window.alert("Ocorreu um erro ao recomendar os jogos.\nTente novamente mais tarde.");
                });
        };

        $scope.avaliarRecomendacao = (nota) => {
            body = {'option': $scope.listaSimples, 'recomendation': $scope.recomendacao, 'nota':nota};
            $http.post(`http://localhost:5000/recomendation/evaluation`, body)
                .then(function (response) {
                    if(response.data==1){
                        $window.alert("Obrigado por avaliar nosso sistema!");
                    }else{
                        $window.alert("Obrigado por avaliar nosso sistema! Estamos melhorando para te oferecer as melhores opções.");
                    }
                    $scope.verAvaliacao = false;
                })
                .catch(function () {
                    $window.alert("Ocorreu um erro ao avaliar os jogos.\nTente novamente mais tarde.");
                });
        };
    })