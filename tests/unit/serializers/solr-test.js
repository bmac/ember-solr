import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';
import DS from 'ember-data';

moduleFor('serializer:solr', 'SolrSerializer', {
  needs: ['model:dummy'],
  beforeEach: function() {
    var container = this.container;
    container.register('store:main', DS.Store);

    this.createDummy = function(options) {
      return Ember.run(function() {
        return container.lookup('store:main').createRecord('dummy', options);
      });
    };

    this.store = this.container.lookup('store:main');
    this.dummyType = this.container.lookupFactory('model:dummy');
  }
});

test('extractMeta numFound', function(assert) {
  var serializer = this.subject();
  var payload = {
    response: {
      numFound: 37
    }
  };

  serializer.extractMeta(this.store, this.dummyType, payload);
  var meta = this.store.metadataFor('dummy');

  assert.equal(meta.total, 37, 'meta.total');
});

test('extractMeta offset', function(assert) {
  var serializer = this.subject();
  var payload = {
    response: {
      start: 40
    }
  };

  serializer.extractMeta(this.store, this.dummyType, payload);
  var meta = this.store.metadataFor('dummy');

  assert.equal(meta.offset, 40, 'meta.offset');
});

test('extractSingle doc', function(assert) {
  var serializer = this.subject();
  var payload = {doc: {id: '12' }};

  var result = serializer.extractSingle(this.store, this.dummyType, payload, payload.doc.id, 'find');

  assert.deepEqual(result, {id: '12'});

});

test('extractSingle response.docs', function(assert) {
  var serializer = this.subject();
  var payload = {response: {docs: [{id: '12' }]}};

  var result = serializer.extractSingle(this.store, this.dummyType, payload, '12', 'find');

  assert.deepEqual(result, {id: '12'});

});