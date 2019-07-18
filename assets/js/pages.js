// Declaração de letiáveis
let app = phonon.navigator();

let notif = phonon.notif('#nothingData');
let loadData = phonon.dialog('#load-data');
const URI_API = "https://fgesgestaocampo.com/api";

const LIST_CONTRACTS = URI_API + '/single/contracts';


// Eventos globais
document.on('pagecreated', function () {
    notif.hide();
    document.querySelector('#disable-notification').on('click', () => {
        notif.hide();
    });
    document.querySelector('#update-page').on('click', () => {
        location.reload();
    });
});


// Responsável por administrar a página de login
app.on({page: 'login', preventClose: false, content: null}, function (activity) {
    activity.onReady(() => {

        document.querySelector('#loginButton').on('click', function () {
            login();
        });

    });

    let login = () => {
        let loginDialog = phonon.dialog('#login-dialog');
        let email = document.querySelector('#email-login');
        let password = document.querySelector('#password-login');

        if (email.value === '' || password.value === '') {
            errorAlert('E-mail e senha são obrigatórios!');
            return;
        }

        loginDialog.open();
        axios.post(URI_API + '/auth/login', {
            email: email.value,
            password: password.value
        }).then((response) => {
            localStorage.token = response.data.token;
            localStorage.email = email.value;
            localStorage.password = password.value;

            axios.post(URI_API + '/pointer-login', {
                email: email.value.toString(),
                password: password.value.toString()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + response.data.token
                }
            })
                .then((response) => {
                    loginDialog.close();

                    if (response.data.code === 404) {
                        errorAlert(response.data.message);
                    } else if (response.data.code === 401) {
                        errorAlert(response.data.message);
                    } else if (response.data.code === 200) {
                        successAlert(response.data.message);
                        // Salva os ID do apontador e muda de página
                        localStorage.user_id = response.data.userID;
                        localStorage.user_name = response.data.userName;
                        localStorage.team_id = response.data.teamID;
                        app.changePage('dashboard');

                        // Limpa os campos
                        email.value = '';
                        password.value = '';
                    }
                })
                .catch((err) => {
                    loginDialog.close();
                    errorAlert(err.toString());
                });
        }).catch((err) => {
            loginDialog.close();
            if (err.response.status === 401) {
                errorAlert("Dados incorretos, tente novamente.")
            } else {
                errorAlert(err.toString());
            }
        });
    }
});

app.on({page: 'dashboard', preventClose: false, content: 'dashboard.html', readyDelay: 1}, function (activity) {
    activity.onClose(function (self) {
        self.close();
    });
    activity.onReady(function () {
        notif.hide();
    });
});

// Telas de relatório
// Primeira tela - Data
app.on({page: 'step-one', preventClose: false, content: 'report/step-one.html', readyDelay: 1}, (activity) => {

    activity.onReady(() => {
        notif.hide();
        let date = document.querySelector('#date');
        date.value = localStorage.data;
    });
});

// Segunda tela - Saída / KM Inicial
app.on({page: 'step-two', preventClose: false, content: 'report/step-two.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        notif.show();

        let saida = document.querySelector('#saidaTrevo');
        let kmOnibus = document.querySelector('#kmInicialOnibus');

        // Insere os valores que estão no LocalStorage, se não tiver, preenche com null
        saida.value = localStorage.saidaTrevo;
        kmOnibus.value = localStorage.kmInicialOnibus;
    })
});

// Consumo
app.on({page: 'step-three', preventClose: false, content: 'report/step-three.html', readyDelay: 1}, (activity) => {

    activity.onReady(() => {
        //  Mostra a notificação
        notif.show();

        let qntAux = document.querySelector('#qntAux');
        let qntFisc = document.querySelector('#qntFisc');
        let qntApon = document.querySelector('#qntApon');
        let qntCoor = document.querySelector('#qntCoor');
        let qntFalt = document.querySelector('#qntFalt');
        let qntAtes = document.querySelector('#qntAtes');
        let qntFolg = document.querySelector('#qntFolg');

        // Insere os valores que estão no LocalStorage, se não tiver, preenche com null
        qntAux.value = localStorage.qntAux;
        qntFisc.value = localStorage.qntFisc;
        qntApon.value = localStorage.qntApon;
        qntCoor.value = localStorage.qntCoor;
        qntFalt.value = localStorage.qntFalt;
        qntAtes.value = localStorage.qntAtes;
        qntFolg.value = localStorage.qntFolg;
    });
});
// Contratos
app.on({page: 'step-four', preventClose: false, content: 'report/step-four.html', readyDelay: 1}, (activity) => {

});

app.on({page: 'step-five', preventClose: false, content: 'report/step-five.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        let chegadaCampo = document.querySelector('#chegada-campo');

        // Insere os valores que estão no LocalStorage, se não tiver, preenche com null
        chegadaCampo.value = localStorage.chegadaCampo;
    });
});

app.on({page: 'step-six', preventClose: false, content: 'report/step-six.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        notif.show();

        let banheiro = document.querySelector('#qntd-banheiro');
        let pao = document.querySelector('#qntd-pao');
        let banana = document.querySelector('#qntd-banana');
        let cafe = document.querySelector('#qntd-cafe');
        let almoco = document.querySelector('#qntd-almoco');
        let jantar = document.querySelector('#qntd-jantar');
        let diaria = document.querySelector('#qntd-diaria');

        banheiro.value = localStorage.banheiro;
        pao.value = localStorage.pao;
        banana.value = localStorage.banana;
        cafe.value = localStorage.cafe;
        almoco.value = localStorage.almoco;
        jantar.value = localStorage.jantar;
        diaria.value = localStorage.diaria;
    });
});

app.on({page: 'step-seven', preventClose: false, content: 'report/step-seven.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        let loading = phonon.indicator('Aguarde, carregando as atividades do contrato...', false);
        new Vue({
            el: '#step-seven',
            data: {
                activities: [],
                activity_id: "nothing",
                storageContracts: [],
                valor_gasto: 0,
                contract_id: localStorage.contract_id
            },
            methods: {
                saveActivity() {
                    if (this.activity_id === "nothing" || this.activity_id === null) {
                        errorAlert('Por favor, selecione um contrato antes de continuar.');
                    } else {
                        localStorage.activity_id = this.activity_id;
                        localStorage.valor_gasto = this.valor_gasto;
                        successAlert('Atividade armazenada com sucesso!');
                        app.changePage('step-eight');
                    }
                },
                getActivities() {
                    axios.post(URI_API + '/auth/login', {
                        email: localStorage.email,
                        password: localStorage.password
                    }).then((response) => {
                        axios.get(URI_API + '/activity-contract/' + this.contract_id + '/0', {
                            headers: {
                                Authorization: "Bearer " + response.data.token
                            }
                        }).then((response) => {
                            // Carrega os dados na combo
                            this.activities = response.data;

                            // Seleciona o contrato que já foi selecionado
                            if (localStorage.activity_id) {
                                this.activity_id = localStorage.activity_id;
                            }
                            // Finaliza com a mensagem
                            let loaded = phonon.notif('Atividades sincronizadas!', 3000, true, 'OK');
                            loaded.setColor('bg-green');
                        }).catch((err) => {
                            errorAlert(err.toString());
                        });
                    }).catch((err) => {
                        errorAlert(err.toString());
                    });
                },
                loadActivities() {

                    /*
                    * Verifica o total de contratos armazenados, se for menor do que está na API
                    * ele carrega os contratos e guarda novamente
                    */

                    axios.post(URI_API + '/auth/login', {
                        email: localStorage.email,
                        password: localStorage.password
                    }).then((response) => {

                        axios.get(URI_API + '/activity-contract/' + this.contract_id + '/1', {
                            headers: {
                                Authorization: "Bearer " + response.data.token
                            }
                        }).then((response) => {
                            if (localStorage.storageActivities) {
                                loading.close();
                                let convertedJSON = JSON.parse(localStorage.storageActivities);
                                let totalActivities = response.data;

                                if (convertedJSON.length < totalActivities) {
                                    console.log('É bom sincronizar');
                                    this.getActivities();
                                    loading.close();
                                } else if (convertedJSON.length === totalActivities) {
                                    console.log('Ele está sincronizado, agora pode fazer o trabalho');

                                    this.activities = convertedJSON;
                                    if (localStorage.activity_id) {
                                        this.activity_id = localStorage.activity_id;
                                    }
                                    loading.close();
                                }
                            } else {
                                loading.close();
                                this.getActivities();
                            }


                        }).catch((err) => {
                            loading.close();
                            errorAlert(err.toString());
                        });
                    }).catch((err) => {
                        errorAlert(err.toString());
                    });

                }
            },
            mounted() {
                // Faz a requisição na API e pega todos as atividades cadastradas
                this.loadActivities();
            }
        });
    });
});

app.on({page: 'step-eight', preventClose: false, content: 'report/step-eight.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        let saidaCampo = document.querySelector('#saida-campo');
        saidaCampo.value = localStorage.saidaCampo;
    });
});

app.on({page: 'step-nine', preventClose: false, content: 'report/step-nine.html', readyDelay: 1}, function (activity) {
    activity.onReady(() => {
        let chegadaTrevo = document.querySelector('#chegada-trevo');
        chegadaTrevo.value = localStorage.chegadaTrevo;
    })
});

app.on({page: 'step-ten', preventClose: false, content: 'report/step-ten.html', readyDelay: 1}, function (activity) {

});
app.on({page: 'step-eleven', preventClose: false, content: 'report/step-eleven.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        notif.show();

        let origem = document.querySelector('#origem');
        let destino = document.querySelector('#destino');
        let contrato = document.querySelector('#contrato');

        origem.value = localStorage.origem ? localStorage.origem : '';
        destino.value = localStorage.destino ? localStorage.destino : '';
        contrato.value = localStorage.localTrabalhado ? localStorage.localTrabalhado : '';

    });
});

app.on({page: 'step-twelve', preventClose: false, content: 'report/step-twelve.html', readyDelay: 1}, (activity) => {
    activity.onReady(() => {
        let hec_manual = document.querySelector('#hec-manual');
        let hec_mecanico = document.querySelector('#hec-mecanico');

        hec_manual.value = localStorage.hec_manual ? localStorage.hec_manual : 0;
        hec_mecanico.value = localStorage.hec_mecanico ? localStorage.hec_mecanico : 0;
    });
});

app.on({
    page: 'step-thirteen',
    preventClose: false,
    content: 'report/step-thirteen.html',
    readyDelay: 1
}, (activity) => {

    activity.onReady(() => {
        notif.show();

        new Vue({
            el: '#step-thirteen',
            data: {
                integrants: []
            },
            methods: {
                getIntegrants() {
                    loadData.open();
                    axios.post(URI_API + '/auth/login', {
                        email: localStorage.email,
                        password: localStorage.password
                    }).then((response) => {

                        axios
                            .get(URI_API + '/single/integrants-team/' + localStorage.user_id, {
                                headers: {
                                    Authorization: "Bearer " + response.data.token
                                }
                            })
                            .then((response) => {
                                if (response.data.length === 0) {
                                    errorAlert("Não existe nenhum integrante na sua equipe.");
                                }
                                this.integrants = response.data.sort();

                                loadData.close();
                            })
                            .catch((err) => {
                                errorAlert(err.toString());
                                loadData.close();
                            });

                    }).catch((err) => {
                        errorAlert(err.toString());
                    });
                },
                serialize() {
                    let form = document.querySelector('#integrants-form');
                    localStorage.storageAvaliations = this.toJSONString(form);

                    successAlert('Dados armazenados com sucesso!');
                    let newActivity = phonon.confirm('', 'Teve atividade 02?', false, 'Sim', 'Não');

                    newActivity.on('confirm', () => {
                        this.saveReport();
                        app.changePage('step-one');
                    });
                    newActivity.on('cancel', () => {
                        this.saveReport();
                        app.changePage('dashboard');
                    });
                },
                toJSONString(form) {
                    let obj = [];
                    let elements = form.querySelectorAll("input");
                    for (let i = 0; i < elements.length; ++i) {
                        let element = elements[i];

                        let name = element.name;
                        let value = element.value;
                        let id = element.dataset.id;

                        let data = {
                            "name": name,
                            "value": value,
                            "integrant_id": id,
                            'data': localStorage.data
                        };

                        obj.push(data);
                    }

                    return JSON.stringify(obj);
                },
                saveReport() {
                    axios.post(URI_API + '/auth/login', {
                        email: localStorage.email,
                        password: localStorage.password
                    }).then((response) => {

                        let data = {
                            name: localStorage.user_name,

                            activity_id: localStorage.activity_id,
                            contract_id: localStorage.contract_id,
                            transport_id: localStorage.transport_id,
                            client_id: localStorage.client_id,
                            pointer_id: localStorage.user_id,

                            data: localStorage.data,
                            saidaTrevo: localStorage.saidaTrevo,
                            kmInicialOnibus: localStorage.kmInicialOnibus,
                            qntAux: localStorage.qntAux,
                            qntFisc: localStorage.qntFisc,
                            qntApon: localStorage.qntApon,
                            qntCoor: localStorage.qntCoor,
                            qntFalt: localStorage.qntFalt,
                            qntAtes: localStorage.qntAtes,
                            qntFolg: localStorage.qntFolg,
                            chegadaCampo: localStorage.chegadaCampo,
                            banheiro: localStorage.banheiro,
                            pao: localStorage.pao,
                            banana: localStorage.banana,
                            cafe: localStorage.cafe,
                            almoco: localStorage.almoco,
                            jantar: localStorage.jantar,
                            diaria: localStorage.diaria,
                            saidaCampo: localStorage.saidaCampo,
                            chegadaTrevo: localStorage.chegadaTrevo,
                            origem: localStorage.origem,
                            destino: localStorage.destino,
                            localTrabalhado: localStorage.localTrabalhado,
                            hec_manual: localStorage.hec_manual,
                            hec_mec: localStorage.hec_mecanico,
                            avaliations: localStorage.storageAvaliations,
                            val_gasto: localStorage.valor_gasto,
                            kmFinalOnibus: localStorage.kmFinalOnibus,
                            team_id: localStorage.team_id
                        };

                        axios.post(URI_API + '/single/save-report-mobile', data, {
                            headers: {
                                Authorization: "Bearer " + response.data.token
                            }
                        }).then((res) => {
                            if (res.status === 201 && res.statusText === "Created") {
                                successAlert("O seu relatório foi salvo com sucesso!");
                                this.clearStorage();
                            }
                        }).catch((err) => {
                            errorAlert(err.toString());
                            console.log(err);
                        });

                    }).catch((err) => {
                        errorAlert(err.toString());
                    });
                },
                clearStorage() {
                    localStorage.removeItem('activity_id');
                    localStorage.removeItem('contract_id');
                    localStorage.removeItem('transport_id');
                    localStorage.removeItem('storageContracts');
                    localStorage.removeItem('storageActivities');
                    localStorage.removeItem('data');
                    localStorage.removeItem('saidaTrevo');
                    localStorage.removeItem('kmInicialOnibus');
                    localStorage.removeItem('kmFinalOnibus');
                    localStorage.removeItem('qntAux');
                    localStorage.removeItem('qntFisc');
                    localStorage.removeItem('qntApon');
                    localStorage.removeItem('qntCoor');
                    localStorage.removeItem('qntFalt');
                    localStorage.removeItem('qntAtes');
                    localStorage.removeItem('qntFolg');
                    localStorage.removeItem('chegadaCampo');
                    localStorage.removeItem('banheiro');
                    localStorage.removeItem('pao');
                    localStorage.removeItem('banana');
                    localStorage.removeItem('cafe');
                    localStorage.removeItem('almoco');
                    localStorage.removeItem('jantar');
                    localStorage.removeItem('diaria');
                    localStorage.removeItem('saidaCampo');
                    localStorage.removeItem('chegadaTrevo');
                    localStorage.removeItem('origem');
                    localStorage.removeItem('destino');
                    localStorage.removeItem('localTrabalhado');
                    localStorage.removeItem('hec_manual');
                    localStorage.removeItem('hec_mecanico');
                    localStorage.removeItem('storageAvaliations');
                    localStorage.removeItem('valor_gasto');
                }
            },
            mounted() {
                this.getIntegrants();
            }
        });
    });
});