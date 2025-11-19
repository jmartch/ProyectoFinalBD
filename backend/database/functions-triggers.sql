use global_kids;

delimiter $$

create trigger tr_crear_nota_estudiante
after insert on estudiante
for each row
begin
    insert into nota (doc_estudiante, definitiva)
    values (new.doc_estudiante, 0.00);
end$$

create procedure recalcular_definitiva(in p_id_nota int)
begin
    declare resultado decimal(10,2);

    select sum(dn.nota * (c.porcentaje / 100))
    into resultado
    from detalle_nota dn
    inner join componente c on dn.id_componente = c.id_componente
    where dn.id_nota = p_id_nota;

    if resultado is null then
        set resultado = 0;
    end if;

    update nota
    set definitiva = resultado
    where id_nota = p_id_nota;
end$$

create trigger trg_definitiva_insert
after insert on detalle_nota
for each row
begin
    call recalcular_definitiva(NEW.id_nota);
end$$

create trigger trg_definitiva_update
after update on detalle_nota
for each row
begin
    call recalcular_definitiva(NEW.id_nota);
end$$

create trigger trg_definitiva_delete
after delete on detalle_nota
for each row
begin
    call recalcular_definitiva(OLD.id_nota);
end$$

delimiter ;