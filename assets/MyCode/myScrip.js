$(document).ready(function () {

    var DialogOpen = false;
    function getDsStudents() {
        $.post("api.aspx",
            {
                action: "DsSinhVien"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var s = '<table id="id-sinhvien" class="table table-hover">';
                    s += '<thead>' +
                        '<tr align="center" class="table-info fw-bold thead-danger">' +
                        '<th>STT</th>'+
                        '<th>MaSV</th>' +
                        '<th>TenSV</th>' +
                        '<th>NgaySinh</th>' +
                        '<th>GioiTinh</th>' +
                        '<th>SoDienThoai</th>' +
                        '<th>Lop</th>' +
                        '<th>Sửa/xóa</th>'+
                        '</tr>'+
                        '</thead>' +
                        '<tbody>';
                    var stt = 0;
                    var gt = '';
                    for (var item of json.Ls) {
                        stt++;
                        s += '<tr align="center">';
                        s += '<td>' + stt + '</td>';
                        s += '<td>' + item.masv + '</td>';
                        s += '<td>' + item.tensv + '</td>';
                        s += '<td>' + (item.NgaySinh ? item.NgaySinh.split('T')[0] : '') + '</td>';
                        if (item.gioiTinh == 1) {
                            gt = "Male";
                        } else {
                            gt = "Female";
                        }
                        s += '<td>' + gt + '</td>';
                        s += '<td>' + item.sdt + '</td>';
                        s += '<td>' + item.Lop + '</td>';
                        var action = '<button class="btn btn-sm btn-primary btn-action-sinhvien" data-action="update_sinhvien" data-masv="' + item.masv + '" data-tensv="' + item.tensv + '"  data-ngaysinh="' + item.NgaySinh + '" data-gioitinh="' + item.gioiTinh + '" data-sodienthoai="' + item.sdt + '" data-lop="' + item.Lop + '"  title="Update sinhvien"><i class="fa-solid fa-pen"></i></button>';
                        action += ' <button class="btn btn-sm btn-danger btn-action-sinhvien" data-action="delete_sinhvien" data-masv="' + item.masv + '" data-tensv="' + item.tensv + '" title="Delete sinhvien"><i class="fa-solid fa-trash"></i></button>';
                        s += '<td>' + action + '</td>';
                    }
                    s += '</tboy></table>';
                    $('#id-sinhvien').html(s);

                    $('#id-sinhvien').on('click', 'button[data-action="update_sinhvien"], button[data-action="delete_sinhvien"]', function (e) {
                        e.stopPropagation();
                        var action = $(this).data('action');
                        var masv = $(this).data('masv');
                        var tensv = $(this).data('tensv');
                        var ngaysinh = $(this).data('ngaysinh');
                        var gioiTinh = $(this).data('gioitinh');
                        var SDT = $(this).data('sodienthoai');
                        var Lop = $(this).data('lop');

                        if (action === 'update_sinhvien') {
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            UpdateSv(masv,tensv,ngaysinh,gioiTinh,SDT,Lop);
                        } else if (action === 'delete_sinhvien') {
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            DeleteSV(masv, tensv);
                        }
                    });

                } else {
                    //error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    function UpdateSv(masv, tensv, ngaysinh, gioiTinh, SDT, Lop) {
        $.confirm({
            columnClass: 'm',
            title: `Cập Nhật sinh viên mã => ${masv}`, 
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'TenSinhVien:' +
                '<input type="text" id="id-tensv" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap Ten sinhvien!!</div>' +
                'NgaySinh:' +
                '<input type="date" id="id-ngaysinh" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap Ngaysinh!!</div>' +

                'GioiTinh:' +
                '<select class="form-control" id="id-GioiTinh" required>' +
                '<option value="">chọn Giới Tính</option>' +
                '<option value="0">Female</option>' +
                '<option value="1">Male</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn Giới Tính!</div>' +

                'SoDienThoai:' +
                `<input type="number" id="id-sodienthoai" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoDienThoai!!</div>' +
                'Lop:' +
                `<input type="text" id="id-lopsv" class="form-control" required  />` +
                '<div class="invalid-feedback">Hay Nhap Lop!!</div>' +
                '</form>',
            buttons: {
                add: {
                    text: 'update sv',
                    btnClass: 'btn btn-warning',
                    action: function () {
                        var form = document.querySelector('.needs-validate');
                        if (form.checkValidity() === false) {
                            form.classList.add('was-validated');
                            return false; // Prevent the dialog not close when validation failss
                        } else {
                            $.post("api.aspx",
                                {
                                    action: "updateSV",
                                    masv: masv,
                                    tensv: $('#id-tensv').val(),
                                    ngaysinh: $('#id-ngaysinh').val(),
                                    gioiTinh: $('#id-GioiTinh').val(),
                                    sdt: $('#id-sodienthoai').val(),
                                    lop: $('#id-lopsv').val()
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        getDsStudents();
                                        DialogOpen = false; //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                });
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {
                        DialogOpen = false; //close dialog
                    }
                }
            },
            onContentReady: function () {
                var NgaySinh = ngaysinh.split('T')[0];
                document.getElementById('id-tensv').value = tensv;
                document.getElementById('id-ngaysinh').value = NgaySinh;
                document.getElementById('id-GioiTinh').value = gioiTinh;
                document.getElementById('id-sodienthoai').value = SDT;
                document.getElementById('id-lopsv').value = Lop;
            }
        });
    }

    function DeleteSV(masv, tensv) {
        $.confirm({
            columnClass: 'm',
            title: `Delete Sinh Vien`,
            content: `Bạn có chắn xóa sinhvien có masv = ${masv} và tên = ${tensv}?`,
            autoClose: 'close|20000',
            buttons: {
                add: {
                    text: 'xác nhận',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        $.post("api.aspx",
                            {
                                action: "DeleteSV",
                                masv: masv,
                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    getDsStudents();
                                    DialogOpen = false; //close dialog
                                } else {
                                    ErrorDialog(json.msg);
                                }
                            });
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {
                        DialogOpen = false; //close dialog
                    }
                }
            }
        });
    }

    function ErrorDialog(_content) {
        $.confirm({
            closeIcon: true,
            type: 'red',
            title: 'Erorr',
            content: _content,
            autoClose: 'close|20000', //20000 milSecond=20s
            buttons: {
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {

                    }
                }
            },
        });
    }

    function AddSV() {
        $.confirm({
            columnClass: 'm',
            title: 'Thêm sinh viên',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'Masinhvien:' +
                '<input type="text" id="id-masv" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap Ma sv!!</div>' +
                'TenSinhVien:' +
                '<input type="text" id="id-tensv" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap Ten sinhvien!!</div>' +
                'NgaySinh:' +
                '<input type="date" id="id-ngaysinh" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap Ngaysinh!!</div>' +

                'GioiTinh:' +
                '<select class="form-control" id="id-GioiTinh" required>' +
                '<option value="">chọn Giới Tính</option>' +
                '<option value="0">Female</option>' +
                '<option value="1">Male</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn Giới Tính!</div>' +
                
                'SoDienThoai:' +
                `<input type="number" id="id-sodienthoai" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoDienThoai!!</div>' +
                'Lop:' +
                `<input type="text" id="id-lopsv" class="form-control" required  />` +
                '<div class="invalid-feedback">Hay Nhap Lop!!</div>' +
                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add sv',
                    btnClass: 'btn-warning',
                    action: function () {
                        //check validate
                        var form = document.querySelector('.needs-validate');
                        if (form.checkValidity() === false) {
                            form.classList.add('was-validated');
                            return false; // Prevent the dialog not close when validation failss
                        } else {
                            $.post("api.aspx",
                                {
                                    action: "addSinhvien",
                                    masv: $('#id-masv').val(),
                                    tensv: $('#id-tensv').val(),
                                    ngaysinh: $('#id-ngaysinh').val(),
                                    gioiTinh: $('#id-GioiTinh').val(),
                                    sdt: $('#id-sodienthoai').val(),
                                    lop: $('#id-lopsv').val()
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        getDsStudents();
                                        DialogOpen = false; //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                });
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-primary',
                    action: function () { }
                }
            }
        });
    }

    function getDsHopDong() {
        $.post("api.aspx",
            {
                action: "DsHopDong"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var s = '<table id="id-hopdong" class="table table-hover">';
                    s += '<thead>' +
                        '<tr align="center" class="table-info fw-bold thead-danger">' +
                        '<th>STT</th>' +
                        '<th>MaHopDong</th>' +
                        '<th>Masv</th>' +
                        '<th>TenSv</th>' +
                        '<th>Maphong</th>' +
                        '<th>TenPhong</th>' +
                        '<th>NgayBatDau</th>' +
                        '<th>NgayKetThuc</th>' +
                        '<th>Sửa/xóa</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    var stt = 0;
                    for (var item of json.LH) {
                        stt++;
                        s += '<tr align="center">';
                        s += '<td>' + stt + '</td>';
                        s += '<td>' + item.mahopdong + '</td>';
                        s += '<td>' + item.masv + '</td>';
                        s += '<td>' + item.tensv + '</td>';
                        s += '<td>' + item.maphong + '</td>';
                        s += '<td>' + item.tenphong + '</td>';
                        s += '<td>' + (item.ngayBatDau ? item.ngayBatDau.split('T')[0] : '') + '</td>';
                        s += '<td>' + (item.ngayKetThuc ? item.ngayKetThuc.split('T')[0] : '') + '</td>';

                        var action = '<button class="btn btn-sm btn-primary" data-action="update_hopdong" data-mahopdong="' + item.mahopdong + '" data-masv="' + item.masv + '"  data-tensv="' + item.tensv + '" data-maphong="' + item.maphong + '" data-tenphong="' + item.tenphong + '" data-ngaybatdau="' + item.ngayBatDau + '" data-ngayketthuc="' + item.ngayKetThuc + '"  title="Update HopDong">Sửa</button>';
                        action += ' <button class="btn btn-sm btn-danger" data-action="delete_hopdong" data-mahopdong="' + item.mahopdong + '" title="Delete HopDong">Xóa</button>';
                        s += '<td>' + action + '</td>';
                    }
                    s += '</tboy></table>';
                    $('#id-hopdong').html(s);

                    $('#id-hopdong').on('click', 'button[data-action="update_hopdong"], button[data-action="delete_hopdong"]', function (e) {
                        e.stopPropagation();
                        var action = $(this).data('action');
                        var mahopdong = $(this).data('mahopdong');
                        var masv = $(this).data('masv');
                        var tensv = $(this).data('tensv');
                        var maphong = $(this).data('maphong');
                        var tenphong = $(this).data('tenphong');
                        var ngaybatdau = $(this).data('ngaybatdau');
                        var ngayketthuc = $(this).data('ngayketthuc');

                        if (action === 'update_hopdong') {
                          
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            UpdateHopDong(mahopdong, masv, tensv, maphong, tenphong, ngaybatdau, ngayketthuc );
                        } else if (action === 'delete_hopdong') {
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            DeleteHopDong(mahopdong);
                        }
                    });

                } else {
                    //error 
                    ErrorDialog(json.reply.msg);
                }
            });
    } 

    function UpdateHopDong(mahopdong, masv, tensv, maphong, tenphong, ngaybatdau, ngayketthuc)
    {
        $.confirm({
            columnClass: 'm',
            title: `Cập Nhật HopDong mã hopdong => ${mahopdong}`,
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaHopDong:' +
                '<input type="text" id="id-mahopdong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaHopDong!!</div>' +

                'Masv:' +
                '<select class="form-control" id="id-masvhopdong" required>' +
                '<option value="">chọn masv</option>' +
                '<option>masv1</option>' +
                '<option>masv2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn masv!</div>' +
                'tensv:' +
                '<input type="text" id="id-tensv" class="form-control" readonly />' +

                'MaPhong:' +
                '<select class="form-control" id="id-maphonghopdong" required>' +
                '<option value="">chọn maphong</option>' +
                '<option>Maphong1</option>' +
                '<option>Maphong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'tenphong:' +
                '<input type="text" id="id-tenphong" class="form-control" readonly />' +

                'NgayBatDau:' +
                '<input type="date" id="id-ngayBatDau" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap NgayBatDau!!</div>' +

                'NgayKetThuc:' +
                '<input type="date" id="id-NgayKetThuc" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap NgayKetThuc!!</div>' +
                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'update sv',
                    btnClass: 'btn btn-warning',
                    action: function () {
                        var form = document.querySelector('.needs-validate');
                        if (form.checkValidity() === false) {
                            form.classList.add('was-validated');
                            return false; // Prevent the dialog not close when validation failss
                        } else {
                            $.post("api.aspx",
                                {
                                    action: "",
                                  /*  masv: masv,*/
                                    //tensv: $('#id-tensv').val(),
                                    //ngaysinh: $('#id-ngaysinh').val(),
                                    //gioiTinh: $('#id-GioiTinh').val(),
                                    //sdt: $('#id-sodienthoai').val(),
                                    //lop: $('#id-lopsv').val()
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        getDsStudents();
                                        DialogOpen = false; //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                });
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {
                        DialogOpen = false; //close dialog
                    }
                }
            },
            onContentReady: function () {
                loadMaSvSelector(masv, 'id-tensv');
                document.getElementById('id-tensv').value = tensv;
                //var NgaySinh = ngaysinh.split('T')[0];
                //document.getElementById('').value = masv ;
                //document.getElementById('').value = ;
                //document.getElementById('').value = ;
                //document.getElementById('').value = ;
                //document.getElementById('').value = ;
            }
        });
    }

    function DeleteHopDong(mahopdong) {
        $.confirm({
            columnClass: 'm',
            title: `Delete HopDong`,
            content: `Bạn có chắn xóa MaHopDong = ${mahopdong}?`,
            autoClose: 'close|30000',
            buttons: {
                add: {
                    text: 'xác nhận',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        $.post("api.aspx",
                            {
                                action: "DeleteHopDong",
                                MahopDong: mahopdong
                                
                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    getDsHopDong();
                                    DialogOpen = false; //close dialog
                                } else {
                                    ErrorDialog(json.msg);
                                }
                            });
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {
                        DialogOpen = false; //close dialog
                    }
                }
            }
        });
    }

    function GetSelectorMasv(idInputtensv) {
        $.post("api.aspx",
            {
                action: "DsAllMaSv"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var SelectMaSv = document.getElementById("id-masvhopdong");
                    // Clear existing options
                    SelectMaSv.innerHTML = '';

                    // Create and add the default option
                    var defaultOption = document.createElement("option");
                    defaultOption.value = ''; // Set an empty value for the default option
                    defaultOption.text = 'chọn mã sinh viện'; // Set the text for the default option
                    SelectMaSv.appendChild(defaultOption);

                    // Add a focus event listener to hide the default option when the dropdown is clicked
                    SelectMaSv.addEventListener("focus", function () {
                        this.querySelector("option[value='']").style.display = "none";
                    });

                    // Add a blur event listener to show the default option when the dropdown is not focused
                    SelectMaSv.addEventListener("blur", function () {
                        if (this.value === "") {
                            this.querySelector("option[value='']").style.display = "block";
                        }
                    });

                    
                    // Loop through the data and add options to the select element
                    for (var i = 0; i < json.Ls.length; i++) {
                        var option = document.createElement("option");
                        option.value = json.Ls[i].masv;
                        option.text = json.Ls[i].masv;

                        SelectMaSv.appendChild(option);
                    }

                    // Add change event listener to the select element
                    SelectMaSv.addEventListener("change", function () {
                        var Masv = this.value;
                        var selectedTensv = json.Ls.find(item => item.masv === Masv)?.tensv || '';

                        document.getElementById(idInputtensv).value = selectedTensv;
                    });

                }else{
                    //Error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }


    function GetSelectorMaPhong(idInputTenphong)
    {
        $.post("api.aspx",
            {
                action: "DsAllMaPhong"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var SelectedMaPhong = document.getElementById('id-maphonghopdong');
                    // Clear existing options
                    SelectedMaPhong.innerHTML = '';

                    // Create and add the default option
                    var defaultOption = document.createElement("option");
                    defaultOption.value = ''; // Set an empty value for the default option
                    defaultOption.text = 'chọn Maphong'; // Set the text for the default option
                    SelectedMaPhong.appendChild(defaultOption);

                    // Add a focus event listener to hide the default option when the dropdown is clicked
                    SelectedMaPhong.addEventListener("focus", function () {
                        this.querySelector("option[value='']").style.display = "none";
                    });

                    // Add a blur event listener to show the default option when the dropdown is not focused
                    SelectedMaPhong.addEventListener("blur", function () {
                        if (this.value === "") {
                            this.querySelector("option[value='']").style.display = "block";
                        }
                    });


                    // Loop through the data and add options to the select element
                    for (var i = 0; i < json.Lp.length; i++) {
                        var option = document.createElement("option");
                        option.value = json.Lp[i].maphong;
                        option.text = json.Lp[i].maphong;

                        SelectedMaPhong.appendChild(option); //push to selector
                    }

                    // Add change event listener to the select element
                    SelectedMaPhong.addEventListener("change", function () {
                        var MaPhong = this.value;
                        var selectedTenPhong = json.Lp.find(item => item.maphong === MaPhong)?.tenphong || '';

                        document.getElementById(idInputTenphong).value = selectedTenPhong;
                    });

                } else {
                    //Error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }
  

    //load for update and delete
    function loadMaSvSelector(selectedMasv, idInputtensv) {
        $.post("api.aspx",
            {
                action: "DSallsv"
            },
            function (data) {
                var json = JSON.parse(data); 
                if (json.reply.ok) {
                    var SELECTEDmasv = document.getElementById('id-masvhopdong');
                    // Clear existing options
                    SELECTEDmasv.innerHTML = '';

                    // Find the index of the selectedTenNVID in the array
                    var selectedIndex = json.Lsv.findIndex(function (item) {
                        return item.masv == selectedMasv;
                    });

                    // If the selected is found, add it to the beginning of the array
                    if (selectedIndex !== -1) {
                        var masvselect = json.Lsv[selectedIndex];
                        json.Lsv.splice(selectedIndex, 1);
                        json.Lsv.unshift(masvselect);
                    }

                    // Loop through the data and add options to the select element
                    for (var i = 0; i < json.Lsv.length; i++) {
                        var option = document.createElement("option");
                        option.value = json.Lsv[i].masv;
                        option.text = json.Lsv[i].masv;
                        SELECTEDmasv.appendChild(option);
                    }
                    
                    // Add change event listener to the select element
                    SELECTEDmasv.addEventListener("change", function () {
                        var Masv = this.value;
                        var selectedTensv = json.Lsv.find(item => item.masv === Masv)?.tensv || '';

                        document.getElementById(idInputtensv).value = selectedTensv;
                    });
                } else {
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    function AddHopDong() {
        $.confirm({
            columnClass: 'm',
            title: 'Thêm Hop Dong',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaHopDong:' +
                '<input type="text" id="id-mahopdong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaHopDong!!</div>' +

                'Masv:' +
                '<select class="form-control" id="id-masvhopdong" required>' +
                '<option value="">chọn masv</option>' +
                '<option>masv1</option>' +
                '<option>masv2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn masv!</div>' +
                'tensv:' +
                '<input type="text" id="id-tensv" class="form-control" readonly />' +

                'MaPhong:' +
                '<select class="form-control" id="id-maphonghopdong" required>' +
                '<option value="">chọn maphong</option>' +
                '<option>Maphong1</option>' +
                '<option>Maphong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'tenphong:' +
                '<input type="text" id="id-tenphong" class="form-control" readonly />' +
                
                'NgayBatDau:' +
                '<input type="date" id="id-ngayBatDau" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap NgayBatDau!!</div>' +

                'NgayKetThuc:' +
                '<input type="date" id="id-NgayKetThuc" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap NgayKetThuc!!</div>' +
                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add HopDong',
                    btnClass: 'btn-warning',
                    action: function () {
                        //check validate
                        var form = document.querySelector('.needs-validate');
                        if (form.checkValidity() === false) {
                            form.classList.add('was-validated');
                            return false; // Prevent the dialog not close when validation failss
                        } else {
                            $.post("api.aspx",
                                {
                                    action: "addHopDong",
                                    mahopdong: $('#id-mahopdong').val(),
                                    masv: $('#id-masvhopdong').val(),
                                    /*tensv: $('#id-tensv').val(),*/
                                    maphong: $('#id-maphonghopdong').val(),
                                    ngaybatdau : $('#id-ngayBatDau').val(),
                                    ngayKetThuc : $('#id-NgayKetThuc').val()
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        getDsHopDong();
                                        DialogOpen = false;  //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                    return false; //not close dialog
                                });
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-primary',
                    action: function () { }
                }
            },
            onContentReady: function () {
                GetSelectorMasv('id-tensv');
                GetSelectorMaPhong('id-tenphong');
            }
        });
    }


    $('#idhopdong').on('click', function () {
        getDsHopDong();
        $.confirm({
            closeIcon: false,
            type: 'blue',
            typeAnimated: true,
            draggable: true,
            columnClass: 'xl',
            title: 'Danh Sách Hop Dong',
            content: '<div id="id-hopdong"></div>',
            buttons: {
                add: {
                    text: 'add hopdong',
                    btnClass: 'btn-secondary',
                    action: function () {
                        AddHopDong();
                        return false; // not close dialog
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {
                    }
                }
            }
        });
    });
    
    $('#idsinhvien').on('click', function () {
        getDsStudents();
        $.confirm({
            closeIcon: false,
            type: 'blue',
            typeAnimated: true,
            draggable: true,
            columnClass: 'l',
            title: 'Danh Sách Sinh Viện',
            content: '<div id="id-sinhvien"></div>',
            buttons: {
                add: {
                    text: 'add sv',
                    btnClass: 'btn-secondary',
                    action: function () {
                        AddSV();
                        return false; // not close dialog
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-blue',
                    action: function () {
                    }
                }
            },
            onContentReady: function () {

            }
        });
    });

    //function DataTable have search paginate and...
    function sort_Table_Simple(id) {
        $(id).dataTable({
            "paging": true,    // Enable pagination
            "searching": true, // Enable search
            "info": true,     // 
            "ordering": true,  // Enable sorting
            "order": [[0, 'asc']], // Sort by the first column in ascending order by default
            "lengthMenu": [10, 25, 50], // Customize the page length menu
            //change property to Tieng viet
            "language": {
                "decimal": "",
                "emptyTable": "Không có dữ liệu",
                "info": "Hiển thị từ dòng _START_ đến dòng _END_ trong tổng số _TOTAL_ dòng",
                "infoEmpty": "Showing 0 to 0 of 0 entries",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Hiển thị _MENU_ dòng",
                "loadingRecords": "Đang tải dữ liệu...",
                "processing": "Đang xử lý...",
                "search": "Tìm kiếm:",
                "zeroRecords": "Không tìm thấy lớp nào phù hợp",
                "paginate": {
                    "first": "Trang đầu",
                    "last": "Trang cuối",
                    "next": "Trang sau",
                    "previous": "Trang trước"
                }
            }
        });
    }
});