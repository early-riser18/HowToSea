# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: tuto.proto
# Protobuf Python Version: 5.27.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    27,
    2,
    '',
    'tuto.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\ntuto.proto\"\x16\n\x05Token\x12\r\n\x05token\x18\x01 \x02(\t\"\x1c\n\x0bTokenStatus\x12\r\n\x05valid\x18\x01 \x02(\x08\x32/\n\x04\x41uth\x12\'\n\rValidateToken\x12\x06.Token\x1a\x0c.TokenStatus\"\x00')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'tuto_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_TOKEN']._serialized_start=14
  _globals['_TOKEN']._serialized_end=36
  _globals['_TOKENSTATUS']._serialized_start=38
  _globals['_TOKENSTATUS']._serialized_end=66
  _globals['_AUTH']._serialized_start=68
  _globals['_AUTH']._serialized_end=115
# @@protoc_insertion_point(module_scope)
