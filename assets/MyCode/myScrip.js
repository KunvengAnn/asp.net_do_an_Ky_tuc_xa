
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
                                        DialogOpen = false;
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
                                    DialogOpen = false;
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
                        action += ' <button class="btn btn-sm btn-danger" data-action="delete_hopdong" data-mahopdong="' + item.mahopdong + '" data-maphong="' + item.maphong + '" title="Delete HopDong">Xóa</button>';
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
                            DeleteHopDong(mahopdong, maphong);
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
                '<input type="text" id="id-mahopdong" class="form-control" readonly />' +
                '<div class="invalid-feedback">Hay Nhap MaHopDong!!</div>' +

                'Masv:' +
                '<input type="text" id="id-masvhopdong" class="form-control" readonly />' +
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
                                    action: "updateHopDong",
                                    MahopDong: mahopdong,
                                    Masv: $('#id-masvhopdong').val(),
                                    MaPhong: $('#id-maphonghopdong').val(),
                                    ngayBayDau: $('#id-ngayBatDau').val(),
                                    ngayKetThuc: $('#id-NgayKetThuc').val()
                                    
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        getDsHopDong();
                                        DialogOpen = false; //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                        DialogOpen = false;
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
                /*loadMaSvSelector(masv, 'id-tensv');*/
                document.getElementById('id-masvhopdong').value = masv;
                document.getElementById('id-tensv').value = tensv;
                loadMaPhongSelector(maphong, 'id-tenphong');

                document.getElementById('id-tenphong').value = tenphong;
                document.getElementById('id-mahopdong').value = mahopdong;

                var NgayBatDau = ngaybatdau.split('T')[0];
                var NgayKetThuc = ngayketthuc.split('T')[0];
                document.getElementById('id-ngayBatDau').value = NgayBatDau ;
                document.getElementById('id-NgayKetThuc').value = NgayKetThuc ;

            }
        });
    }

    function DeleteHopDong(mahopdong, maphong) {
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
                                MahopDong: mahopdong,
                                Maphong: maphong    
                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    getDsHopDong();
                                    DialogOpen = false; //close dialog
                                } else {
                                    ErrorDialog(json.msg);
                                    DialogOpen = false;
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

    function GetSelectorMasv(idInputtensv, idInputGioiTinh) {
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
                        var selectedGioiTinh = json.Ls.find(item => item.masv === Masv)?.gioiTinh || '';

                        document.getElementById(idInputtensv).value = selectedTensv;
                        var GioiTinhSv = '';
                        if (selectedGioiTinh == 1) {
                            GioiTinhSv = "Male";
                        } else {
                            GioiTinhSv = "Female";
                        }
                        document.getElementById(idInputGioiTinh).value = GioiTinhSv;
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
                    SelectedMaPhong.innerHTML = "";

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
    //function loadMaSvSelector(selectedMasv, idInputtensv) {
    //    $.post("api.aspx",
    //        {
    //            action: "DsAllMaSv"
    //        },
    //        function (data) {
    //            var json = JSON.parse(data); 
    //            if (json.reply.ok) {
    //                var SELECTEDmasv = document.getElementById('id-masvhopdong');
    //                // Clear existing options
    //                SELECTEDmasv.innerHTML = '';

    //                // Find the index of the selectedTenNVID in the array
    //                var selectedIndex = json.Ls.findIndex(function (item) {
    //                    return item.masv == selectedMasv;
    //                });

    //                // If the selected is found, add it to the beginning of the array
    //                if (selectedIndex !== -1) {
    //                    var masvselect = json.Lsv[selectedIndex];
    //                    json.Ls.splice(selectedIndex, 1);
    //                    json.Ls.unshift(masvselect);
    //                }

    //                // Loop through the data and add options to the select element
    //                for (var i = 0; i < json.Ls.length; i++) {
    //                    var option = document.createElement("option");
    //                    option.value = json.Ls[i].masv;
    //                    option.text = json.Ls[i].masv;
    //                    SELECTEDmasv.appendChild(option);
    //                }
                    
    //                // Add change event listener to the select element
    //                SELECTEDmasv.addEventListener("change", function () {
    //                    var Masv = this.value;
    //                    var selectedTensv = json.Ls.find(item => item.masv === Masv)?.tensv || '';

    //                    document.getElementById(idInputtensv).value = selectedTensv;
    //                });
    //            } else {
    //                ErrorDialog(json.reply.msg);
    //            }
    //        });
    //}

    function loadMaPhongSelector(MaPhong, InputTenPhong) {
        $.post("api.aspx", {
            action: "DsAllMaPhong"
        }, function (data) {
            var json = JSON.parse(data);
            if (json.reply.ok) {
                var SELECTEDmaphong = document.getElementById('id-maphonghopdong');
                // Clear existing options
                SELECTEDmaphong.innerHTML = '';

                // Find the index of the selected MaPhong in the array
                var selectedIndex = json.Lp.findIndex(function (item) {
                    return item.maphong == MaPhong;
                });

                // If the selected MaPhong is found, add it to the beginning of the array
                if (selectedIndex !== -1) {
                    var maphongselect = json.Lp[selectedIndex];
                    json.Lp.splice(selectedIndex, 1);
                    json.Lp.unshift(maphongselect);
                }

                // Loop through the data and add options to the select element
                for (var i = 0; i < json.Lp.length; i++) {
                    var option = document.createElement("option");
                    option.value = json.Lp[i].maphong;
                    option.text = json.Lp[i].maphong;
                    option.setAttribute('data-tenphong', json.Lp[i].tenphong); // Store tenphong as data attribute
                    SELECTEDmaphong.appendChild(option);
                }

                // Add change event listener to the select element
                SELECTEDmaphong.addEventListener("change", function () {
                    var MaPhong = this.value;
                    var selectedOption = this.options[this.selectedIndex];
                    var selectedTenPhong = selectedOption.getAttribute('data-tenphong') || '';

                    document.getElementById(InputTenPhong).value = selectedTenPhong;
                });

                // Trigger change event to initialize the InputTenPhong value
                SELECTEDmaphong.dispatchEvent(new Event('change'));
            } else {
                ErrorDialog(json.reply.msg);
            }
        });
    }


    function GetDsPhong() {
        $.post("api.aspx",
            {
                action: "DsPhong"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var s = '<table id="id-phong" class="table table-hover">';
                    s += '<thead>' +
                        '<tr align="center" class="table-info fw-bold thead-danger">' +
                        '<th>STT</th>' +
                        '<th>MaPhong</th>' +
                        '<th>TenPhong</th>' +
                        '<th>MaLoaiPhong</th>' +
                        '<th>TenLoaiPhong</th>' +
                        '<th>SoNguoi</th>' +
                        '<th>Sửa/xóa</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    var stt = 0;
                    for (var item of json.Lp) {
                        stt++;
                        s += '<tr align="center">';
                        s += '<td>' + stt + '</td>';
                        s += '<td>' + item.maphong + '</td>';
                        s += '<td>' + item.tenphong + '</td>';
                        s += '<td>' + item.maloaiphong + '</td>';
                        s += '<td>' + item.tenlaoiphong + '</td>';
                        s += '<td>' + item.SoNguoi + '</td>';

                        var action = '<button class="btn btn-sm btn-primary" data-action="update_phong" data-maphong="' + item.maphong + '" data-tenphong="' + item.tenphong + '"  data-maloaiphong="' + item.maloaiphong + '" data-tenlaoiphong="' + item.tenlaoiphong + '" data-songuoi="' + item.SoNguoi + '"   title="Update HopDong">Sửa</button>';
                        action += ' <button class="btn btn-sm btn-danger" data-action="delete_phong" data-maphong="' + item.maphong + '" data-tenphong="' + item.tenphong + '" title="Delete HopDong">Xóa</button>';
                        s += '<td>' + action + '</td>';
                    }
                    s += '</tboy></table>';
                    $('#id-phong').html(s);

                    $('#id-phong').on('click', 'button[data-action="update_phong"], button[data-action="delete_phong"]', function (e) {
                        e.stopPropagation();
                        var action = $(this).data('action');
                        var maphong = $(this).data('maphong');
                        var tenphong = $(this).data('tenphong');
                        var maloaiphong = $(this).data('maloaiphong');
                        var tenlaoiphong = $(this).data('tenlaoiphong');
                        var songuoi = $(this).data('songuoi');


                        if (action === 'update_phong') {
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            UpdatePhong(maphong, tenphong, maloaiphong, tenlaoiphong, songuoi);
                        } else if (action === 'delete_phong') {
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            DeletePhong(maphong);
                        }
                    });

                } else {
                    //error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    function DeletePhong(maphong) {
       var dialogDeletePhong = $.confirm({
            columnClass: 'm',
            title: `Delete Phong`,
            content: `Bạn có chắn xóa MaPhong = ${maphong}?`,
            autoClose: 'close|30000',
            buttons: {
                add: {
                    text: 'xác nhận',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        $.post("api.aspx",
                            {
                                action: "DeletePhong",
                                MaPhong: maphong

                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    GetDsPhong();
                                    dialogDeletePhong.close();
                                    DialogOpen = false; //close dialog
                                } else {
                                    ErrorDialog(json.msg);
                                    DialogOpen = false;
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

    function UpdatePhong(maphong, tenphong, maloaiphong, tenlaoiphong, songuoi) {
    var dialogUpdatePhong = $.confirm({
            columnClass: 'm',
            title: 'Update Phong',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaPhong:' +
                '<input type="text" id="id-maphong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaPhong!!</div>' +
                'TenPhong:' +
                '<input type="text" id="id-TenPhong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap TenPhong!!</div>' +

                'MaLoaiPhong:' +
                '<select class="form-control" id="id-maloaiphong" required>' +
                '<option value="">chọn MaLoaiPhong</option>' +
                '<option>MaLoaiPhong1</option>' +
                '<option>MaLoaiPhong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'TenLoaiPhong:' +
                '<input type="text" id="id-tenloaiphong" class="form-control" readonly />' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'Update Phong',
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
                                    action: "UpdatePhong",
                                    MaPhong: $('#id-maphong').val(),
                                    TenPhong: $('#id-TenPhong').val(),
                                    MaLoaiPhong: $('#id-maloaiphong').val(),

                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        GetDsPhong();
                                        dialogUpdatePhong.close();
                                        DialogOpen = false;  //close dialog
                                    } else {
                                        //error 
                                        DialogOpen = true;
                                        ErrorDialog(json.msg);

                                    }
                                });
                            return false; //not close dialog  
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-primary',
                    action: function () {
                        DialogOpen = false; 
                    }
                }
            },
            onContentReady: function () {
                document.getElementById('id-maphong').value = maphong;
                document.getElementById('id-TenPhong').value = tenphong;
                LoadSelectorMaLoaiPhong(maloaiphong, 'id-tenloaiphong', 'id-maloaiphong');
            }
        });
    }

    function AddHopDong() {
    var dialogAddHP =  $.confirm({
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
                'GioiTinhSv:' +
                '<input type="text" id="id-gioitinhsv" class="form-control" readonly />' +

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
                                        dialogAddHP.close();
                                    } else {
                                        //error 
                                        DialogOpen = true;
                                        ErrorDialog(json.msg);
                                                                    
                                    }
                                });
                            return false; //not close dialog  
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
                GetSelectorMasv('id-tensv','id-gioitinhsv');
                GetSelectorMaPhong('id-tenphong');
            }
        });
    }

    function LoadSelectorMaLoaiPhong(MaLoaiPhong, InputidTenLoaiPhong,InputIdMaLoaiPhong) {
        $.post("api.aspx", {
            action: "DsMaLoaiPhong"
        }, function (data) {
            var json = JSON.parse(data);
            if (json.reply.ok) {
                var SELECTMaloaiPhong = document.getElementById(InputIdMaLoaiPhong);
                // Clear existing options
                SELECTMaloaiPhong.innerHTML = '';

                // Find the index of the selected MaPhong in the array
                var selectedIndex = json.Lml.findIndex(function (item) {
                    return item.maphong == MaLoaiPhong;
                });

                // If the selected MaPhong is found, add it to the beginning of the array
                if (selectedIndex !== -1) {
                    var maloaiphongselect = json.Lml[selectedIndex];
                    json.Lml.splice(selectedIndex, 1);
                    json.Lml.unshift(maphongselect);
                }

                // Loop through the data and add options to the select element
                for (var i = 0; i < json.Lml.length; i++) {
                    var option = document.createElement("option");
                    option.value = json.Lml[i].maloaiphong;
                    option.text = json.Lml[i].maloaiphong;
                    option.setAttribute('data-tenloaiphong', json.Lml[i].tenlaoiphong); // Store tenphong as data attribute
                    option.setAttribute('data-maloaiphong', json.Lml[i].maloaiphong); // Store maloaiphong as data attribute
                    SELECTMaloaiPhong.appendChild(option);
                }

                // Add change event listener to the select element
                SELECTMaloaiPhong.addEventListener("change", function () {
                    var MaLoaiPhong = this.value;
                    var selectedOption = this.options[this.selectedIndex];
                    var selectedTenLoaiPhong = selectedOption.getAttribute('data-tenloaiphong') || '';
                    var selectedMaLoaiPhong = selectedOption.getAttribute('data-maloaiphong') || '';

                    document.getElementById(InputidTenLoaiPhong).value = selectedTenLoaiPhong;
                    document.getElementById(InputIdMaLoaiPhong).value = selectedMaLoaiPhong;
                });

                // Trigger change event to initialize the InputTenPhong and InputMaLoaiPhong values
                SELECTMaloaiPhong.dispatchEvent(new Event('change'));
            } else {
                ErrorDialog(json.reply.msg);
            }
        });
    }

    function GetSelectorMaLoaiPhong(idInputTenLoaiphong, idInputMaLoaiphong, idInputDonGia) {
        $.post("api.aspx",
            {
                action: "DsMaLoaiPhong"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var SelectedMaLoaiPhong = document.getElementById(idInputMaLoaiphong);
                    // Clear existing options
                    SelectedMaLoaiPhong.innerHTML = "";

                    // Create and add the default option
                    var defaultOption = document.createElement("option");
                    defaultOption.value = ''; // Set an empty value for the default option
                    defaultOption.text = 'chọn MaLoaiphong'; // Set the text for the default option
                    SelectedMaLoaiPhong.appendChild(defaultOption);

                    // Add a focus event listener to hide the default option when the dropdown is clicked
                    SelectedMaLoaiPhong.addEventListener("focus", function () {
                        this.querySelector("option[value='']").style.display = "none";
                    });

                    // Add a blur event listener to show the default option when the dropdown is not focused
                    SelectedMaLoaiPhong.addEventListener("blur", function () {
                        if (this.value === "") {
                            this.querySelector("option[value='']").style.display = "block";
                        }
                    });


                    // Loop through the data and add options to the select element
                    for (var i = 0; i < json.Lml.length; i++) {
                        var option = document.createElement("option");
                        option.value = json.Lml[i].maloaiphong;
                        option.text = json.Lml[i].maloaiphong;

                        SelectedMaLoaiPhong.appendChild(option); //push to selector
                    }

                    // Add change event listener to the select element
                    SelectedMaLoaiPhong.addEventListener("change", function () {
                        var MaLoaiPhong = this.value;
                        var selectedTenLoaiPhong = json.Lml.find(item => item.maloaiphong === MaLoaiPhong)?.tenlaoiphong || '';
                        var selectedDonGiaLoaiPhong = json.Lml.find(item => item.maloaiphong === MaLoaiPhong)?.DonGiaPhong || '';

                        document.getElementById(idInputTenLoaiphong).value = selectedTenLoaiPhong
                        document.getElementById(idInputDonGia).value = selectedDonGiaLoaiPhong;
                    });

                } else {
                    //Error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    function AddPhong() {
        var dialogAddPhong = $.confirm({
            columnClass: 'm',
            title: 'Thêm Phong',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaPhong:' +
                '<input type="text" id="id-maphong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaPhong!!</div>' +
                'TenPhong:' +
                '<input type="text" id="id-TenPhong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap TenPhong!!</div>' +

                'MaLoaiPhong:' +
                '<select class="form-control" id="id-maloaiphong" required>' +
                '<option value="">chọn MaLoaiPhong</option>' +
                '<option>MaLoaiPhong1</option>' +
                '<option>MaLoaiPhong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'TenLoaiPhong:' +
                '<input type="text" id="id-tenloaiphong" class="form-control" readonly />' +
                'DonGiaLoaiPhong:' +
                '<input type="text" id="id-dongia-loaiphong" class="form-control" readonly />' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add Phong',
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
                                    action: "AddPhong",
                                    MaPhong: $('#id-maphong').val(),
                                    TenPhong: $('#id-TenPhong').val(),
                                    MaLoaiPhong: $('#id-maloaiphong').val(),
                                   
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        GetDsPhong();
                                        DialogOpen = false;  //close dialog
                                        dialogAddPhong.close();
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                        DialogOpen = false;
                                    }
                                });
                            return false; //not close dialog  
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
                GetSelectorMaLoaiPhong('id-tenloaiphong', 'id-maloaiphong', 'id-dongia-loaiphong');
            }
        });
    }

    $('#idphong').on('click', function () {
        GetDsPhong();
        $.confirm({
            closeIcon: false,
            type: 'blue',
            typeAnimated: true,
            draggable: true,
            columnClass: 'l',
            title: 'Danh Sách Phong',
            content: '<div id="id-phong"></div>',
            buttons: {
                add: {
                    text: 'add phong',
                    btnClass: 'btn-secondary',
                    action: function () {
                        AddPhong();
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

    function GetLoaiPhong() {
        $.post("api.aspx", {
            action: "DsLoaiPhong"
        }, function (data) {
            var json = JSON.parse(data);
            if (json.reply.ok) {
                var s = '<table id="id-LoaiPhong" class="table table-hover">';
                s += '<thead>' +
                    '<tr align="center" class="table-info fw-bold thead-danger">' +
                    '<th>STT</th>' +
                    '<th>MaloaiPhong</th>' +
                    '<th>TenLoaiPhong</th>' +
                    '<th>DonGia</th>' +
                    '<th>Sửa/xóa</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
                var stt = 0;
                for (var item of json.Lph) {
                    stt++;
                    s += '<tr align="center">';
                    s += '<td>' + stt + '</td>';
                    s += '<td>' + item.maloaiphong + '</td>';
                    s += '<td>' + item.tenlaoiphong + '</td>';
                    s += '<td>' + item.DonGiaPhong.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + '</td>';

                    var action = '<button class="btn btn-sm btn-primary" data-action="update_loaiphong" data-maloaiphong="' + item.maloaiphong + '" data-tenloaiphong="' + item.tenlaoiphong + '" data-dongia="' + item.DonGiaPhong + '" title="Update HopDong">Sửa</button>';
                    action += ' <button class="btn btn-sm btn-danger" data-action="delete_loaiphong" data-maloaiphong="' + item.maloaiphong + '" data-tenloaiphong="' + item.tenlaoiphong + '" title="Delete HopDong">Xóa</button>';
                    s += '<td>' + action + '</td>';
                    s += '</tr>';
                }
                s += '</tbody></table>';
                $('#id-LoaiPhong').html(s);

                $('#id-LoaiPhong').on('click', 'button[data-action="update_loaiphong"], button[data-action="delete_loaiphong"]', function (e) {
                    e.stopPropagation();
                    var action = $(this).data('action');
                    var maloaiphong = $(this).data('maloaiphong');
                    var tenloaiphong = $(this).data('tenloaiphong');
                    var dongia = $(this).data('dongia');

                    if (action === 'update_loaiphong') {
                        if (DialogOpen) {
                            return;
                        }
                        DialogOpen = true;
                        // Call function for updating LoaiPhong here
                        UpdateLoaiPhong(maloaiphong, tenloaiphong, dongia);
                    } else if (action === 'delete_loaiphong') {
                        if (DialogOpen) {
                            return;
                        }
                        DialogOpen = true;
                        // Call function for deleting LoaiPhong here
                        DeleteLoaiPhong(maloaiphong);
                    }
                });
            } else {
                // Error 
                ErrorDialog(json.reply.msg);
            }
        });
    }

    function UpdateLoaiPhong(maloaiphong, tenloaiphong, dongia) {
        $.confirm({
            columnClass: 'm',
            title: 'Thêm LoaiPhong',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaLoaiPhong:' +
                '<input type="text" id="id-maloaiphong" class="form-control" readonly />' +
                '<div class="invalid-feedback">Hay Nhap MaLoaiPhong!!</div>' +

                'TenLoaiPhong:' +
                '<input type="text" id="id-tenloaiphong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap TenLoaiPhong!!</div>' +
                'DonGiaPhong:' +
                `<input type="number" id="id-dongiaphong" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap DonGiaPhong!!</div>' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'Update Loai Phong MaLoaiPhong',
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
                                    action: "UpdateLoaiPhong",
                                    MaLoaiPhong: maloaiphong,
                                    TenLoaiPhong: $('#id-tenloaiphong').val(),
                                    DonGiaLoaiPhong: $('#id-dongiaphong').val(),

                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        GetLoaiPhong();
                                        DialogOpen = false;  //close dialog

                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                        DialogOpen = false;
                                    }
                                });

                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-primary',
                    action: function () { DialogOpen = false; }
                }
            },
            onContentReady: function () {
                document.getElementById('id-maloaiphong').value = maloaiphong;
                document.getElementById('id-tenloaiphong').value = tenloaiphong;
                document.getElementById('id-dongiaphong').value = dongia;
            }
        });
    }

    function DeleteLoaiPhong(maloaiphong) {
        $.confirm({
            columnClass: 'm',
            title: `Delete DienNuoc`,
            content: `Bạn có chắn xóa MaLoaiPhong = ${maloaiphong}?`,
            autoClose: 'close|30000',
            buttons: {
                add: {
                    text: 'xác nhận',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        $.post("api.aspx",
                            {
                                action: "DeleteLoaiPhong",
                                MaLoaiPhong: maloaiphong

                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    GetLoaiPhong();
                                    DialogOpen = false; //close dialog

                                } else {
                                    ErrorDialog(json.msg);
                                    DialogOpen = false;
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

    function AddLoaiPhong() {
        $.confirm({
            columnClass: 'm',
            title: 'Thêm LoaiPhong',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaLoaiPhong:' +
                '<input type="text" id="id-maloaiphong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaLoaiPhong!!</div>' +
             
                'TenLoaiPhong:' +
                '<input type="text" id="id-tenloaiphong" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap TenLoaiPhong!!</div>' +
                'DonGiaPhong:' +
                `<input type="number" id="id-dongiaphong" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap DonGiaPhong!!</div>' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add Loai Phong',
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
                                    action: "AddLoaiPhong",
                                    MaLoaiPhong: $('#id-maloaiphong').val(),
                                    TenLoaiPhong: $('#id-tenloaiphong').val(),
                                    DonGiaLoaiPhong: $('#id-dongiaphong').val(),

                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        GetLoaiPhong();
                                        DialogOpen = false;  //close dialog

                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                        DialogOpen = false;
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
            },
            onContentReady: function () {
                
            }
        });
    }

    $('#idLoaiPhong').on('click', function () {
        GetLoaiPhong();
        $.confirm({
            closeIcon: false,
            type: 'blue',
            typeAnimated: true,
            draggable: true,
            columnClass: 'l',
            title: 'Danh Sách LoaiPhong',
            content: '<div id="id-LoaiPhong"></div>',
            buttons: {
                add: {
                    text: 'add LoaiPhong',
                    btnClass: 'btn-secondary',
                    action: function () {
                        AddLoaiPhong();
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

    function GetDsDienNuoc() {
        $.post("api.aspx",
            {
                action: "DsDienNuoc"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var s = '<table id="id-DienNuoc" class="table table-hover">';
                    s += '<thead>' +
                        '<tr align="center" class="table-info fw-bold thead-danger">' +
                        '<th>STT</th>' +
                        '<th>MaDienNuoc</th>' +
                        '<th>MaPhong</th>' +
                        '<th>SoDienDau</th>' +
                        '<th>SoDienCuoi</th>' +
                        '<th>SoNuocDau</th>' +
                        '<th>SoNuocCuoi</th>' +
                        '<th>NgayGhiSo</th>'+
                        '<th>Sửa/xóa</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    var stt = 0;
                    for (var item of json.Ld) {
                        stt++;
                        s += '<tr align="center">';
                        s += '<td>' + stt + '</td>';
                        s += '<td>' + item.MaDienNuoc + '</td>';
                        s += '<td>' + item.MaPhong + '</td>';
                        s += '<td>' + item.SoDienDau + '</td>';
                        s += '<td>' + item.SoDienCuoi + '</td>';
                        s += '<td>' + item.SoNuocDau + '</td>';
                        s += '<td>' + item.SoNuocCuoi + '</td>';
                        s += '<td>' +  item.NgayGhiSo.split('T')[0] + '</td>';

                        var action = '<button class="btn btn-sm btn-primary" data-action="update_diennuoc" data-madiennuoc="' + item.MaDienNuoc + '" data-maphong="' + item.MaPhong + '"  data-sodiendau="' + item.SoDienDau + '" data-sodiencuoi="' + item.SoDienCuoi + '" data-sonuocdau="' + item.SoNuocDau + '" data-sonuoccuoi="' + item.SoNuocCuoi + '" data-ngayghiso="' + item.NgayGhiSo +'"   title="Update HopDong">Sửa</button>';
                        action += ' <button class="btn btn-sm btn-danger" data-action="delete_diennuoc" data-madiennuoc="' + item.MaDienNuoc + '" data-maphong="' + item.MaPhong + '" title="Delete HopDong">Xóa</button>';
                        s += '<td>' + action + '</td>';
                    }
                    s += '</tboy></table>';
                    $('#id-DienNuoc').html(s);

                    $('#id-DienNuoc').on('click', 'button[data-action="update_diennuoc"], button[data-action="delete_diennuoc"]', function (e) {
                        e.stopPropagation();
                        var action = $(this).data('action');
                        var madiennuoc = $(this).data('madiennuoc');
                        var maphong = $(this).data('maphong');
                        var sodiendau = $(this).data('sodiendau');
                        var sodiencuoi = $(this).data('sodiencuoi');
                        var sonuocdau = $(this).data('sonuocdau');
                        var sonuoccuoi = $(this).data('sonuoccuoi');
                        var NgayGhiSo = $(this).data('ngayghiso');

                        if (action === 'update_diennuoc') {
                            // Handle update action
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            UpdateDiennuoc(madiennuoc, maphong, sodiendau, sodiencuoi, sonuocdau, sonuoccuoi, NgayGhiSo);
                        } else if (action === 'delete_diennuoc') {
                            // Handle delete action
                            if (DialogOpen) {
                                return;
                            }
                            DialogOpen = true;
                            DeleteDiennuoc(madiennuoc, maphong);
                        }
                    });

                } else {
                    //error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    function UpdateDiennuoc(madiennuoc, maphong, sodiendau, sodiencuoi, sonuocdau, sonuoccuoi, NgayGhiSo) {
     var dialogUpdateDienNuoc = $.confirm({
            columnClass: 'm',
            title: 'Thêm Dien Nuoc',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaDienNuoc:' +
                '<input type="text" id="id-madiennuoc" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaDienNuoc!!</div>' +

                'MaPhong:' +
                '<select class="form-control" id="id-maphonghopdong" required>' +
                '<option value="">chọn maphong</option>' +
                '<option>Maphong1</option>' +
                '<option>Maphong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'tenphong:' +
                '<input type="text" id="id-tenphong" class="form-control" readonly />' +

                'SoDienDau:' +
                `<input type="number" id="id-sodiendau" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoDienDau!!</div>' +
                'SoDienCuoi:' +
                `<input type="number" id="id-sodiencuoi" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoDienCuoi!!</div>' +

                'SoNuocDau:' +
                `<input type="number" id="id-sonuocdau" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoNuocDau!!</div>' +
                'SoNuocCuoi:' +
                `<input type="number" id="id-sonuoccuoi" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoNuocCuoi!!</div>' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'Update DienNuoc',
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
                                    action: "UpdateDienNuoc",
                                    MaDienNuoc: $('#id-madiennuoc').val(),
                                    MaPhong: $('#id-maphonghopdong').val(),
                                    SoDienDau: $('#id-sodiendau').val(),
                                    SoDienCuoi: $('#id-sodiencuoi').val(),
                                    SoNuocDau: $('#id-sonuocdau').val(),
                                    SoNuocCuoi: $('#id-sonuoccuoi').val(),
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        GetDsDienNuoc();
                                        DialogOpen = false; //close dialog
                                        dialogUpdateDienNuoc.close();

                                        GetSeletorForChiTiet_HD('', ''); // Call function to check the condition for load in detail Hoadon Chi tiet
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                        DialogOpen = false;
                                    }
                                });
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-primary',
                    action: function () {
                        DialogOpen = false; //close dialog
                    }
                }
            },
            onContentReady: function () {
                //GetSelectorMaPhong('');
                loadMaPhongSelector(maphong, 'id-tenphong') 

                document.getElementById('id-madiennuoc').value = madiennuoc ;
               // document.getElementById('id-maphonghopdong').value = ;
                document.getElementById('id-sodiendau').value = sodiendau;
                document.getElementById('id-sodiencuoi').value = sodiencuoi;
                document.getElementById('id-sonuocdau').value = sonuocdau;
                document.getElementById('id-sonuoccuoi').value = sonuoccuoi;

            }
        });
    }

    function DeleteDiennuoc(madiennuoc, maphong) {
        $.confirm({
            columnClass: 'm',
            title: `Delete DienNuoc`,
            content: `Bạn có chắn xóa MaDienNuoc = ${madiennuoc}?`,
            autoClose: 'close|30000',
            buttons: {
                add: {
                    text: 'xác nhận',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        $.post("api.aspx",
                            {
                                action: "DeleteDienNuoc",
                                MaDienNuoc: madiennuoc
                                
                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    GetDsDienNuoc();
                                    DialogOpen = false; //close dialog

                                    GetSeletorForChiTiet_HD('', ''); // Call function to check the condition for load in detail Hoadon Chi tiet
                                } else {
                                    ErrorDialog(json.msg);
                                    DialogOpen = false;
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

    function AddDienNuoc() {
    var dialogAddDienNuoc = $.confirm({
            columnClass: 'm',
            title: 'Thêm Dien Nuoc',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaDienNuoc:' +
                '<input type="text" id="id-madiennuoc" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap MaDienNuoc!!</div>' +

                'MaPhong:' +
                '<select class="form-control" id="id-maphonghopdong" required>' +
                '<option value="">chọn maphong</option>' +
                '<option>Maphong1</option>' +
                '<option>Maphong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'tenphong:' +
                '<input type="text" id="id-tenphong" class="form-control" readonly />' +

                'SoDienDau:' +
                `<input type="number" id="id-sodiendau" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoDienDau!!</div>' +
                'SoDienCuoi:' +
                `<input type="number" id="id-sodiencuoi" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoDienCuoi!!</div>' +

                'SoNuocDau:' +
                `<input type="number" id="id-sonuocdau" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoNuocDau!!</div>' +
                'SoNuocCuoi:' +
                `<input type="number" id="id-sonuoccuoi" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap SoNuocCuoi!!</div>' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add DienNuoc',
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
                                    action: "AddDienNuoc",
                                    MaDienNuoc: $('#id-madiennuoc').val(),
                                    MaPhong: $('#id-maphonghopdong').val(),
                                    SoDienDau: $('#id-sodiendau').val(),
                                    SoDienCuoi: $('#id-sodiencuoi').val(),
                                    SoNuocDau: $('#id-sonuocdau').val(),
                                    SoNuocCuoi: $('#id-sonuoccuoi').val(),
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        GetDsDienNuoc();
                                        dialogAddDienNuoc.close();
                                        DialogOpen = false; //close dialog

                                        GetSeletorForChiTiet_HD('', ''); // Call function to check the condition
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                });
                            return false; //not close dialog;
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
                GetSelectorMaPhong('id-tenphong');
            }
        });
    }
    $('#idDienNuoc').on('click', function () {
        GetDsDienNuoc();
        $.confirm({
            closeIcon: false,
            type: 'green',
            typeAnimated: true,
            draggable: true,
            columnClass: 'xl',
            title: 'Danh Sách DienNuoc',
            content: '<div id="id-DienNuoc"></div>',
            buttons: {
                add: {
                    text: 'add DienNuoc',
                    btnClass: 'btn-secondary',
                    action: function () {
                        AddDienNuoc();
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

    function getDsHDDienNuoc() {
        $.post("api.aspx",
            {
                action: "DsHD_DienNuoc"
            },
            function (data) {
                var json = JSON.parse(data);
                if (json.reply.ok) {
                    var s = '<table id="id-HDDienNuoc" class="table table-hover">';
                    s += '<thead>' +
                        '<tr align="center" class="table-info fw-bold thead-danger">' +
                        '<th>STT</th>' +
                        '<th>MaHD</th>' +
                        '<th>MaPhong</th>' +
                        '<th>TenPhong</th>'+
                        '<th>NgayLap</th>' +
                        '<th>ThanhTienDien</th>' +
                        '<th>ThanhTienNuoc</th>' +
                        '<th>TongTien</th>' +

                       /* '<th>Sửa/xóa</th>' +*/
                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    var stt = 0;
                    for (var item of json.LH) {
                        stt++;
                        s += '<tr align="center">';
                        s += '<td>' + stt + '</td>';
                        s += '<td>' + item.MaHD + '</td>';
                        s += '<td>' + item.MaPhong + '</td>';
                        s += '<td>' + item.TenPhong + '</td>';
                        s += '<td>' + item.NgayLap.split('T')[0] + '</td>';
                        s += '<td>' + item.ThanhTienDien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + '</td>';
                        s += '<td>' + item.ThanhTienNuoc.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + '</td>';
                        s += '<td>' + item.TongTien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + '</td>';

                        //var action = '<button class="btn btn-sm btn-primary" data-action="update_hddiennuoc" data-mahd="' + item.MaHD + '" data-maphong="' + item.MaPhong + '"  data-ngaylap="' + item.NgayLap + '" data-thanhtiendien="' + item.ThanhTienDien + '" data-thanhtiennuoc="' + item.ThanhTienNuoc + '" data-tongtien="' + item.TongTien + '"    title="Update HopDong">Sửa</button>';
                        //action += ' <button class="btn btn-sm btn-danger" data-action="delete_hddiennuoc" data-mahd="' + item.MaHD + '" data-maphong="' + item.MaPhong + '" title="Delete HopDong">Xóa</button>';
                        //s += '<td>' + action + '</td>';
                    }
                    s += '</tboy></table>';
                    $('#id-HDDienNuoc').html(s);

                    //$('#id-HDDienNuoc').on('click', 'button[data-action="update_hddiennuoc"], button[data-action="delete_hddiennuoc"]', function (e) {
                    //    e.stopPropagation();
                    //    var action = $(this).data('action');
                    //    var mahopdong = $(this).data('mahopdong');
                    //    var masv = $(this).data('masv');
                    //    var tensv = $(this).data('tensv');
                    //    var maphong = $(this).data('maphong');
                    //    var tenphong = $(this).data('tenphong');
                    //    var ngaybatdau = $(this).data('ngaybatdau');
                    //    var ngayketthuc = $(this).data('ngayketthuc');

                    //    if (action === 'update_hopdong') {

                    //        if (DialogOpen) {
                    //            return;
                    //        }
                    //        DialogOpen = true;
                    //        UpdateHopDong(mahopdong, masv, tensv, maphong, tenphong, ngaybatdau, ngayketthuc);
                    //    } else if (action === 'delete_hopdong') {
                    //        if (DialogOpen) {
                    //            return;
                    //        }
                    //        DialogOpen = true;
                    //        DeleteHopDong(mahopdong, maphong);
                    //    }
                    //});

                } else {
                    //error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    var checkNullforAddHoadonDienNuoc;
    function GetSeletorForChiTiet_HD(InputId , InputIdSeletor) {
        $.post("api.aspx",
            {
                action: "MaHDDienNuoc"
            },
            function (data) {
                var json = JSON.parse(data);
                checkNullforAddHoadonDienNuoc = json.LN;
                //if (!checkNullforAddHoadonDienNuoc || checkNullforAddHoadonDienNuoc.length === 0) {
                //    // Array is null, not an array, or empty
                //    $.confirm({
                //        columnClass: 's',
                //        title: 'Ko cho thêm',
                //        content: 'Hãy add điện Nước trước để có thể thêm hóa đơn được!!',
                //        autoClose: 'close|30000',
                //        buttons: {
                //            ok: {
                //                text: 'thêm luôn',
                //                btnClass: 'btn-blue',
                //                action: function () {
                //                    AddDienNuoc();
                //                }
                //            },
                //            close: {
                //                text: 'close',
                //                btnClass: 'btn-warning',
                //                action: function () { }
                //            }
                //        }
                //    });
                //}
                if (json.reply.ok) {
                    var SelectedMaDienNuoc = document.getElementById(InputIdSeletor);
                    // Clear existing options
                    SelectedMaDienNuoc.innerHTML = "";

                    // Create and add the default option
                    var defaultOption = document.createElement("option");
                    defaultOption.value = ''; // Set an empty value for the default option
                    defaultOption.text = 'chọn MaDienNuoc'; // Set the text for the default option
                    SelectedMaDienNuoc.appendChild(defaultOption);

                    // Add a focus event listener to hide the default option when the dropdown is clicked
                    SelectedMaDienNuoc.addEventListener("focus", function () {
                        this.querySelector("option[value='']").style.display = "none";
                    });

                    // Add a blur event listener to show the default option when the dropdown is not focused
                    SelectedMaDienNuoc.addEventListener("blur", function () {
                        if (this.value === "") {
                            this.querySelector("option[value='']").style.display = "block";
                        }
                    });

                    // Loop through the data and add options to the select element
                    for (var i = 0; i < json.LN.length; i++) {
                        var option = document.createElement("option");
                        option.value = json.LN[i].MaDienNuoc;
                        option.text = json.LN[i].MaDienNuoc;

                        SelectedMaDienNuoc.appendChild(option); //push to selector or add
                    }

                    //// Add change event listener to the select element
                    //SelectedMaPhong.addEventListener("change", function () {
                    //    var MaDienNuoc = this.value;
                    //    var selectedTenPhong = json.LN.find(item => item.MaDienNuoc === MaDienNuoc)?.NgayGhiSo || '';

                    //    document.getElementById().value = NgayGhiSo ;
                    //});

                } else {
                    //Error 
                    ErrorDialog(json.reply.msg);
                }
            });
    }

    function AddCT_HoaDonDienNuoc(MaHD) {
        var dialogAddCT_HDDienNuoc = $.confirm({
            columnClass: 'm',
            title: 'Thêm Chi Tiet HoaDon Dien Nuoc', 
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaHoaDon:' +
                '<input type="text" id="id-mahoadon" class="form-control" readonly />' +
                '<div class="invalid-feedback">Hay Nhap mahoadon!!</div>' +

                'MaDienNuoc:' +
                '<select class="form-control" id="id-madienNuoc" required>' +
                '<option value="">chọn MaDienNuoc</option>' +
                '<option>MaDienNuoc1</option>' +
                '<option>MaDienNuoc2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +

                //'tenphong:' +
                //'<input type="text" id="id-tenphong" class="form-control" readonly />' +

                'DonGiaDien'+
                `<input type="number" id="id-DonGiaDien" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap DonGiaDien!!</div>' +
                'DonGiaNuoc' +
                `<input type="number" id="id-DonGiaNuoc" class="form-control" required min="0" oninput="validity.valid||(value='');" />` +
                '<div class="invalid-feedback">Hay Nhap DonGiaNuoc!!</div>' +
                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add HoaDonCT',
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
                                    action: "AddCT_HD_DienNuoc",
                                    MaHoadon: $('#id-mahoadon').val(),
                                    MaDienNuoc: $('#id-madienNuoc').val(),
                                    DonGiaDien: $('#id-DonGiaDien').val(),
                                    DonGiaNuoc: $('#id-DonGiaNuoc').val() 
                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        getDsHDDienNuoc();
                                        dialogAddCT_HDDienNuoc.close();
                                        DialogOpen = false; //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                });
                            return false; //not close dialog;
                        }
                    }
                },
                close: {
                    text: '<i class="fa fa-circle-xmark"> close',
                    btnClass: 'btn-primary',
                    action: function () {
                        return false; //not close dialog
                    }
                }
            },
            onContentReady: function () {
                document.getElementById('id-mahoadon').value = MaHD;
                GetSeletorForChiTiet_HD('', 'id-madienNuoc');
            }
        });
    }

    function AddHDDienNuoc() {
        var dialogAddHDDienNuoc = $.confirm({
            columnClass: 'm',
            title: 'Thêm HoaDon Dien Nuoc',
            content: '<form class="needs-validate" novalidate>' +
                '<div id="idsuccess" class="d-none alert alert-secondary">Thêm Thành Công🎉👏</div>' +
                'MaHoaDon:' +
                '<input type="text" id="id-mahoadon" class="form-control" required />' +
                '<div class="invalid-feedback">Hay Nhap mahoadon!!</div>' +

                'MaPhong:' +
                '<select class="form-control" id="id-maphonghopdong" required>' +
                '<option value="">chọn maphong</option>' +
                '<option>Maphong1</option>' +
                '<option>Maphong2</option>' +
                '</select>' +
                '<div class="invalid-feedback">chọn mapong!</div>' +
                'tenphong:' +
                '<input type="text" id="id-tenphong" class="form-control" readonly />' +

                '</form>' +
                `<hr>`,
            buttons: {
                add: {
                    text: 'add HoaDon',
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
                                    action: "AddHD_DienNuoc",
                                    MaHD: $('#id-mahoadon').val(),
                                    Maphong: $('#id-maphonghopdong').val(),

                                },
                                function (data) {
                                    var json = JSON.parse(data);
                                    if (json.ok) {
                                        var MaHD = $('#id-mahoadon').val();
                                        getDsHDDienNuoc();
                                        dialogAddHDDienNuoc.close();
                                        AddCT_HoaDonDienNuoc(MaHD);
                                        DialogOpen = false; //close dialog
                                    } else {
                                        //error 
                                        ErrorDialog(json.msg);
                                    }
                                });
                            return false; //not close dialog;
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
                GetSelectorMaPhong('id-tenphong');
            }
        });
    }

    function GetDsCT_hoaDon() {
        $.post("api.aspx", {
            action: "DsCT_HD_DienNuoc"
        }, function (data) {
            var json = JSON.parse(data);
            if (json.reply.ok) {
                var s = '<table id="id-CT-HDDienNuoc" class="table table-hover">';
                s += '<thead>' +
                    '<tr align="center" class="table-info fw-bold thead-danger">' +
                    '<th>STT</th>' +
                    '<th>MaHD</th>' +
                    '<th>MaDienNuoc</th>' +
                    '<th>SoDienDau</th>' +
                    '<th>SoDienCuoi</th>' +
                    '<th>SoNuocDau</th>' +
                    '<th>SoNuocCuoi</th>' +
                    '<th>DonGiaDien</th>' +
                    '<th>DonGiaNuoc</th>' +
                    '<th>ThanhTienDien</th>' +
                    '<th>ThanTienNuoc</th>' +
                    '<th>Delete</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
                var stt = 0;
                for (var item of json.LCT) {
                    stt++;
                    s += '<tr align="center">';
                    s += '<td>' + stt + '</td>';
                    s += '<td>' + item.MaHD + '</td>';
                    s += '<td>' + item.MaDienNuoc + '</td>';
                    s += '<td>' + item.SoDienDau + '</td>';
                    s += '<td>' + item.SoDienCuoi + '</td>';
                    s += '<td>' + item.SoNuocDau + '</td>';
                    s += '<td>' + item.SoNuocCuoi + '</td>';
                    s += '<td>' + item.DonGiaDien + '</td>';
                    s += '<td>' + item.DonGiaNuoc + '</td>';
                    s += '<td>' + item.ThanhTienDien + '</td>';
                    s += '<td>' + item.ThanTienNuoc + '</td>';

                    // Add a delete button for each row
                    var deleteButton = '<button class="btn btn-sm btn-danger delete-ct-hddiennuoc" data-mahd="' + item.MaHD + '" data-madiennuoc="' + item.MaDienNuoc + '">Delete</button>';
                    s += '<td>' + deleteButton + '</td>';

                    s += '</tr>';
                }
                s += '</tbody></table>';
                $('#id-CT-HDDienNuoc').html(s);

                // Add event listener for delete button
                $('#id-CT-HDDienNuoc').on('click', '.delete-ct-hddiennuoc', function () {
                    var maHD = $(this).data('mahd');
                    var maDienNuoc = $(this).data('madiennuoc');
                    if (DialogOpen) {
                        return;
                    }
                    DialogOpen = true;
                    // Add logic to delete the record based on maHD and maDienNuoc
                    DeleteCT_HDDienNuoc(maHD, maDienNuoc);
                });
            } else {
                // Error 
                ErrorDialog(json.reply.msg);
            }
        });
    }

    function DeleteCT_HDDienNuoc(maHD, maDienNuoc) {
      var dialogDeleteCT =  $.confirm({
            columnClass: 'm',
            title: `Delete ChiTietHoaDon`,
            content: `Bạn có chắn xóa MaHoaDon = ${maHD}?`,
            autoClose: 'close|30000',
            buttons: {
                add: {
                    text: 'xác nhận',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        $.post("api.aspx",
                            {
                                action: "DeleteCT_HD_DienNuoc",
                                MaHD: maHD

                            },
                            function (data) {
                                var json = JSON.parse(data);
                                if (json.ok) {
                                    GetDsCT_hoaDon();
                                    getDsHDDienNuoc();
                                    dialogDeleteCT.close();
                                    DialogOpen = false; //close dialog

                                    GetSeletorForChiTiet_HD('', ''); // Call function to check the condition for load in detail Hoadon Chi tiet
                                } else {
                                    ErrorDialog(json.msg);
                                    DialogOpen = false;
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

    function DialogChiTietHoaDon() {
        GetDsCT_hoaDon();
        $.confirm({
            type: 'blue',
            columnClass: 'xl',
            title: 'Dash Sach Chi tiet hoadon',
            content: '<div id="id-CT-HDDienNuoc"></div>',
            buttons: {
                close: {
                    text: 'close',
                    btnClass: 'btn-secondary',
                    action: function () { }
                }
            }
        });
    }

    $('#idHDDienNuoc').on('click', function () {
        getDsHDDienNuoc();
        $.confirm({
            closeIcon: false,
            type: 'blue',
            typeAnimated: true,
            draggable: true,
            columnClass: 'xl',
            title: 'Danh Sách Hoa Don Dien Nuoc',
            content: '<div id="id-HDDienNuoc"></div>',
            buttons: {
                ok: {
                    text: 'Ds_ChiTiet_HoaDon',
                    btnClass: 'btn-info',
                    action: function () {
                        DialogChiTietHoaDon();
                        return false; // not close dialog
                    }
                },
                add: {
                    text: 'add HoaDon',
                    btnClass: 'btn-secondary',
                    action: function () {
                        GetSeletorForChiTiet_HD('', ''); // Call function to check the condition

                        if (!checkNullforAddHoadonDienNuoc || checkNullforAddHoadonDienNuoc.length === 0) {
                            // Array is null or empty, show a confirmation dialog
                            $.confirm({
                                columnClass: 's',
                                title: 'Ko cho thêm',
                                content: 'Hãy add điện Nước trước để có thể thêm hóa đơn được!!',
                                autoClose: 'close|30000',
                                buttons: {
                                    ok: {
                                        text: 'thêm luôn',
                                        btnClass: 'btn-blue',
                                        action: function () {
                                            AddDienNuoc();
                                        }
                                    },
                                    close: {
                                        text: 'close',
                                        btnClass: 'btn-warning',
                                        action: function () { }
                                    }
                                }
                            });
                            return false; // Keep the dialog open
                        } else if(checkNullforAddHoadonDienNuoc.length !=0) {
                            AddHDDienNuoc();
                            return false; // Keep the dialog open
                        }
                    }
                },
                close: {
                    text: 'close',
                    btnClass: 'btn-danger',
                    action: function () { }
                }
            },
            onContentReady: function () {
                GetSeletorForChiTiet_HD('', ''); // Call function to check the condition

               // sort_table(id, fn, pageLength_, message);
            }
        });

    });

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

    //for sort Table and already have Export with Excel
    function sort_table(id, fn, pageLength_, message) {
        $('.jconfirm-holder').width($('.jconfirm-open').width());
        let pageLength = 10;
        if (pageLength_) pageLength = pageLength_;
        if (!fn) fn = "Export";
        if (!message) message = "";

        $(id).dataTable({
            dom: 'Bfrtip',
            "pageLength": pageLength,
            buttons: [
                {
                    extend: 'copyHtml5',
                    title: fn
                },
                {
                    extend: 'excelHtml5',
                    title: fn,
                    messageTop: message,
                },
                //{
                //    extend: 'pdfHtml5', // Add the PDF export button
                //    title: fn,
                //    customize: function (doc) {
                //        // You can customize the PDF document here if needed
                //    }
                //}
            ],

            "order": [],
            "language": {
                "decimal": "",
                "emptyTable": "Không có dữ liệu",
                "info": "Hiển thị từ dòng _START_ đến dòng _END_ trong tổng số _TOTAL_ dòng",
                "infoEmpty": "Showing 0 to 0 of 0 entries",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Show _MENU_ entries",
                "loadingRecords": "Loading...",
                "processing": "Processing...",
                "search": "Tìm kiếm:",
                "zeroRecords": "Không tìm thấy lớp nào phù hợp",
                "paginate": {
                    "first": "Trang đầu",
                    "last": "Trang cuối",
                    "next": "Trang sau",
                    "previous": "Trang trước"
                },
                "aria": {
                    "sortAscending": ": Sắp xếp tăng dần",
                    "sortDescending": ": Sắp xếp giảm dần"
                }
            }
        });
        $('.jconfirm-holder').width($('.jconfirm-open').width());
    }
});